/*jslint white:true, nomen: true, plusplus: true */
/*global mendix, mx, mxui, define, require, browser, devel, console, logger */
/*mendix */
/*
 ProgressBarButton
 ========================
 
 @file      : ProgressBarButton.js
 @version   : 1.0
 @author    : Andries Smit
 @date      : Wed, 25 Oct 2015
 @copyright : Flock of Birds Int BV
 @license   : Apache License V2.0
 
 Documentation
 ========================
 A microflow button widget that shows progress messages and a progress bar 
 during the  processing of microflows. In the MF the messages and percentage 
 can be updated and are show to the user directly.
 
 TODO / Sugestions
 - Widget Option for use of Progress Bar (none, solid, striped, animated)?
 
 */

require([
    "dojo/_base/declare", "mxui/widget/_WidgetBase", "dojo/dom-class",
    "dojo/dom-style", "dojo/dom-construct", "dojo/dom-attr", "dojo/_base/lang"
], function (declare, _WidgetBase, domClass, domStyle, domConstruct, domAttr, dojoLang) {
    "use strict";

    return declare("ProgressBarButton.widget.ProgressBarButton", [_WidgetBase], {
        // Parameters configured in the Modeler.
        caption: "",
        captionAtt: "",
        title: "",
        icon: "",
        buttonStyle: "Default",
        onClickMicroflow: "",
        progressEntity: "",
        progressMessage: "",
        progressMessageAtt: "",
        progressPercentAtt: "",
        progressCancalAtt: "CancelProcessing",
        cancelingCaption: "Canceling in progress",
        progressMicroflow: "",
        confirm: false,
        async: true,
        validate: true,
        blocking: true,
        conQuestion: "Are you sure?",
        conProceed: "Proceed",
        conCancel: "Cancel",
        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _contextObj: null,
        _progressObj: null,
        _progressInterval: 500,
        _updatehandler: null,
        barNode: null,
        msgNode: null,
        msgId: null,
        cancelBtn: null,
        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function () {
            this._contextObj = null;
            this._progressObj = null;
            var btnStyleClass = this.buttonStyle === "link" ? "" : " btn-" + this.buttonStyle.toLowerCase();
            this.button = new mxui.widget.Button({
                caption: this.caption,
                captionAttribute: this.captionAtt,
                title: this.title,
                iconUrl: this.icon,
                onClick: dojoLang.hitch(this, this.onclickEvent),
                renderType: this.buttonStyle.toLowerCase(),
                cssStyle: this.style,
                cssClasses: this.classes + btnStyleClass
            });
            this.fixButton();
            domConstruct.place(this.button.domNode, this.domNode);
            this.progress = new mxui.widget.Progress();
        },
        
        // Fix button, dynamic button replacement.         
        fixButton: function () {
            if (this.button.update)
                return;
            var btn = this.button;
            btn.update = function (obj, callback) {
                btn.unsubscribeAll();
                btn._mxObject = obj;
                if (obj) {
                    //var self = this;
                    btn.subscribe({
                        guid: obj.getGuid(),
                        callback: function () {
                            btn.refresh();
                        }
                    });
                }
                btn.refresh(callback);
            };
            btn.refresh = function (callback) {
                btn.updateOptions(["caption"], btn._mxObject, function (obj) {
                    btn.set("caption", obj.caption);
                    callback && callback();
                });
            };
            btn.updateOptions = function (attrs, obj, callback) {
                var _702 = function (obj, _703, _704) {
                    var _705 = {}, len = _703.length, _706 = len;
                    var _707 = function (_708, v) {
                        _705[_708] = v;
                        if (--_706 === 0) {
                            _704 && _704(_705);
                        }
                    };
                    if (len === 0) {
                        _704 && _704(_705);
                    } else {
                        for (var i = 0; i < len; ++i) {
                            obj.fetch(_703[i][0], dojoLang.hitch(null, _707, _703[i][1]));
                        }
                    }
                };
                if (typeof callback != "function") {
                    throw new Error(this.name + ".updateOptions : invalid callback");
                }
                var self = btn, _70c = {}, _70d = [];
                for (var i = 0, _70e; _70e = attrs[i]; ++i) {
                    var _70f = this[_70e + "Attribute"];
                    if (_70f) {
                        _70d.push([_70f, _70e]);
                    } else {
                        _70c[_70e] = this[_70e];
                    }
                }
                if (obj) {
                    _702(obj, _70d, function (_710) {
                        callback.call(self, dojoLang.mixin({}, _710, _70c));
                    });
                } else {
                    callback.call(this, _70c);
                }
            };
        },
        
        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            console.log(this.id + ".update");
            this._contextObj = obj;
            this.button.update(obj, callback);
        },
        
        // onclick Event is called when the button is clicked, doing asyc sequesnce:
        // confirmation, validation, saving, show progress, call microlow
        onclickEvent: function (evt) {
            var callFunctions = [];
            if (this.confirm) {
                callFunctions.push(this.doConfirmation);
            }
            if (this.validate === true) {
                callFunctions.push(dojoLang.hitch(this.mxform, "validate"));
            }
            callFunctions.push(function (callback) {
                this.mxform.save(callback, function (error) {
                    if (!(error instanceof mendix.lib.ValidationError)) {
                        window.mx.onError(error);
                    }
                });
            });
            if (this._progressObj === null) {
                callFunctions.push(this.createProgressObject);
            }
            callFunctions.push(this.createProgress);
            callFunctions.push(this.callMicroflow);
            this.sequence(callFunctions, null, this);
        },
        
        // Creates a progress object which is used for communication progress betwean server and web UI        
        createProgressObject: function (callback) {
            mx.data.create({
                entity: this.progressEntity,
                callback: function (obj) {
                    this._progressObj = obj;
                    callback && callback();
                },
                error: function (e) {
                    console.log("ProgressBarButton.widget.ProgressBarButton createProgressObject; an error occured creating " + this.progressEntity + " :" + e);
                }
            }, this);
        },
        
        // Show a progress dialog for confirmation.
        doConfirmation: function (cb) {
            window.mx.ui.confirmation({
                content: this.conQuestion,
                proceed: this.conproceed,
                cancel: this.conCancel,
                handler: cb
            });
        },
        
        // Show mx progress dialog and message and progress bar.
        createProgress: function (callback) {
            this.msgId = this.progress.add(this.progressMessage, this.blocking); // open progress modal                
            var msgNodeWrapper = this.progress._msgNode ? this.progress._msgNode : this.progress._messages[this.msgId].node;
            domClass.add(msgNodeWrapper, "withProgressBar"); // mx < 5.10
            this.progress.domNode && domClass.add(this.progress.domNode, "withProgressBar"); // mx > 5.10

            this.msgNode = domConstruct.create("div", {
                class: "message"
            });
            domConstruct.place(this.msgNode, msgNodeWrapper);

            this._progress = domConstruct.create("div", {
                class: "progress progress-striped active"
            });
            this.barNode = domConstruct.create("div", {
                "class": "progress-bar",
                "role": "progressbar",
                "aria-valuemin": "0",
                "aria-valuenow": "0",
                "aria-valuemax": "100"
            });
            domConstruct.place(this.barNode, this._progress);
            domConstruct.place(this._progress, msgNodeWrapper);
            if (this.cancelMicroflow) {
                this.cancelBtn = new mxui.widget.Button({
                    caption: this.processCancel,
                    onClick: dojoLang.hitch(this, this.onclickCancel),
                    cssClasses: "progressCancelBrn"
                });
                domConstruct.place(this.cancelBtn.domNode, msgNodeWrapper);
            }
            this._updatehandler = setInterval(dojoLang.hitch(this, this.updateProgress), this._progressInterval);
            callback();
        },
        
        onclickCancel: function (e) {
            this._progressObj.set(this.progressMessageAtt, this.cancelingCaption);
            this._progressObj.set(this.progressCancalAtt, true);
            mx.data.save({
                mxobj: this._progressObj,
                callback: function () {
                    console.log("Object saved");
                }
            });
        },
        
        // update the progress messages and bar. 
        updateProgress: function () {
            mx.data.get({
                guids: [this._progressObj.getGuid()],
                noCache: true,
                callback: function (objs) {
                    if (objs && objs.length > 0) {
                        var obj = objs[0];
                        this.msgNode.innerHTML = obj.get(this.progressMessageAtt);
                        var value = Math.round(obj.get(this.progressPercentAtt));
                        if (value > 100)
                            value = 100;
                        if (value < 0)
                            value = 0;
                        domStyle.set(this.barNode, "width", value + "%");
                        domAttr.set(this.barNode, "aria-valuenow", value);
                    }
                },
                error: function (e) {
                    logger.error("ProgressBarButton.widget.ProgressBarButton updateProgress: XAS error executing microflow" + e);
                }
            }, this);
        },
        
        // call the microflow and remove progress on finishing
        callMicroflow: function (callback) {
            var self = this;
            mx.data.action({
                params: {
                    actionname: this.onClickMicroflow,
                    applyto: "selection",
                    guids: [this._progressObj.getGuid()]
                },
                context: this.mxcontext,
                async: this.async,
                callback: function () {
                    clearInterval(self._updatehandler);
                    self.progress.remove(self.msgId);
                    callback();
                },
                error: function (e) {
                    clearInterval(self._updatehandler);
                    self.progress.remove(self.msgId);
                    logger.error("ProgressBarButton.widget.ProgressBarButton callMicroflow: XAS error executing microflow" + e);
                    callback();
                }
            });
        },
        
        // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
        uninitialize: function () {
            // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
            this._updatehandler && clearInterval(this._updatehandler);
            this.cancelBtn && this.cancelBtn.uninitialize();
            this.button && this.button.uninitialize();
        }
    });
});