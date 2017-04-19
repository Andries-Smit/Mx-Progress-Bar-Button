/// <reference path="../../../typings/dojo/dojo.d.ts" />
/// <reference path="../../../typings/mendix/mxui.d.ts" />
/// <reference path="../../../typings/mendix/mx.d.ts" />
/// <reference path="../../../typings/mendix/mendix.d.ts" />
/// <reference path="../../../typings/WidgetName/WidgetName.d.ts"/>

/*
 ProgressBarButton
 ========================
 
 @file      : ProgressBarButton.js
 @version   : 1.2
 @author    : Andries Smit
 @date      : Wed, 05 Nov 2015
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

declare var mx: mx.mx;
declare var logger: mendix.logger;

import * as dojoDeclare from "dojo/_base/declare";
import * as _WidgetBase from  "mxui/widget/_WidgetBase";
import * as domClass from "dojo/dom-class";
import * as domStyle from "dojo/dom-style";
import * as domConstruct from "dojo/dom-construct";
import * as domAttr from "dojo/dom-attr";
import * as dojoLang from "dojo/_base/lang";
import * as mxLang from "mendix/lang";

class ProgressBarButton extends _WidgetBase {    
        
    // Parameters configured in the Modeler
    caption: string;
    captionAtt: string;
    title: string;
    icon: string;
    buttonStyle: string;
    onClickMicroflow: string;
    progressEntity: string;
    progressMessage: string;
    progressMessageAtt: string;
    progressPercentAtt: string;
    cancelingCaption: string;
    processCancel: string;
    progressMicroflow: string;
    cancelMicroflow: string;
    confirm: boolean;
    async: boolean;
    validate: boolean;
    blocking: boolean;
    conQuestion: string;
    conProceed: string;
    conCancel: string;
    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    _contextObj: Object;
    _progressObj: mendix.lib.MxObject;
    _progressInterval: number;
    _updatehandler: number;
    barNode: HTMLElement;
    msgNode: HTMLElement;
    msgId: number;
    cancelBtn: mxui.widget._WidgetBase;
    button: mxui.widget._Button;
    progress: mxui.widget.Progress;
    _progress: HTMLElement;
    
    // The TypeScript Contructor, not the dojo consctuctor, move contructor work into widget prototype at bottom of the page. 
    constructor(args?: Object, elem?: HTMLElement) {
        super();
        return new __ProgressBarButton(args, elem);
    }
        
    // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
    postCreate() {
        this._contextObj = null;
        this._progressObj = null;
        var btnStyleClass = this.buttonStyle === "link" ? "" : " btn-" + this.buttonStyle.toLowerCase();
        this.button = new mxui.widget._Button({
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
    }
        
    // Fix button, dynamic button replacement.         
    fixButton() {
        if (this.button.update)
            return;
        var btn = this.button;
        btn.update = function(obj, callback) {
            btn.unsubscribeAll();
            btn._mxObject = obj;
            if (obj) {
                //var self = this;
                btn.subscribe({
                    guid: obj.getGuid(),
                    callback: function() {
                        btn.refresh();
                    }
                });
            }
            btn.refresh(callback);
        };
        btn.refresh = function(callback: Function) {
            btn.updateOptions(["caption"], btn._mxObject, function(obj) {
                btn.set("caption", obj.caption);
                callback && callback();
            });
        };
        btn.updateOptions = function(attrs:string[], obj:mendix.lib.MxObject, callback:Function) {
            var _702 = function(obj, _703, _704) {
                var _705 = {}, len = _703.length, _706 = len;
                var _707 = function(_708, v) {
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
                _702(obj, _70d, function(_710) {
                    callback.call(self, dojoLang.mixin({}, _710, _70c));
                });
            } else {
                callback.call(this, _70c);
            }
        };
    }
        
    // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
    update(obj: mendix.lib.MxObject, callback: Function) {
        this._contextObj = obj;
        this.button.update(obj, callback);
    }
        
    // onclick Event is called when the button is clicked, doing asyc sequesnce:
    // confirmation, validation, saving, show progress, call microlow
    onclickEvent(evt: Event) {
        var callFunctions:Function[] = [];
        if (this.confirm) {
            callFunctions.push(this.doConfirmation);
        }
        if (this.validate === true) {
            callFunctions.push(dojoLang.hitch(this.mxform, this.mxform.validate));
        }
        callFunctions.push(function(callback) {
            this.mxform.save(callback, function(error) {
                if (!(error instanceof mendix.lib.ValidationError)) {
                    mx.onError(error);
                }
            });
        });
        if (this._progressObj === null) {
            callFunctions.push(this.createProgressObject);
        }
        callFunctions.push(this.createProgress);
        callFunctions.push( this.callMicroflow );
        mxLang.sequence(callFunctions, null, this);
    }
            
    // Creates a progress object which is used for communication progress betwean server and web UI        
    createProgressObject(callback) {
        mx.data.create({
            entity: this.progressEntity,
            callback: function(obj) {
                this._progressObj = obj;
                callback && callback();
            },
            error: function(e) {
                console.error("ProgressBarButton.widget.ProgressBarButton createProgressObject; an error occured creating " + this.progressEntity + " :" + e);
            }
        }, this);
    }
        
    // Show a progress dialog for confirmation.
    doConfirmation(cb) {
        mx.ui.confirmation({
            content: this.conQuestion,
            proceed: this.conProceed,
            cancel: this.conCancel,
            handler: cb
        });
    }
        
    // Show mx progress dialog and message and progress bar.
    createProgress(callback) {
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
            this.cancelBtn = new mxui.widget._Button({
                caption: this.processCancel,
                onClick: dojoLang.hitch(this, this.onclickCancel),
                cssClasses: "progressCancelBrn"
            });
            domConstruct.place(this.cancelBtn.domNode, msgNodeWrapper);
        }
        this._updatehandler = window.setInterval(dojoLang.hitch(this, this.updateProgress), this._progressInterval);
        callback();
    }

    onclickCancel() {
        this._progressObj.set(this.progressMessageAtt, this.cancelingCaption);
        mx.data.action({
            params: {
                actionname: this.cancelMicroflow,
                applyto: "selection",
                guids: [this._progressObj.getGuid()]
            },
            callback: function() {
            },
            error: function(e) {
                console.error("ProgressBarButton.widget.ProgressBarButton Cancel Progress: XAS error executing microflow" + this. cancelMicroflow+ " : "  + e);
            },
        }, this);
    }
        
    // update the progress messages and bar. 
    updateProgress() {
        mx.data.get({
            guids: [this._progressObj.getGuid()],
            noCache: true,
            callback: function(objs) {
                if (objs && objs.length > 0) {
                    var obj = objs[0];
                    this.msgNode.innerHTML = obj.get(this.progressMessageAtt);
                    var value = Math.round(obj.get(this.progressPercentAtt));
                    if (value > 100)
                        value = 100;
                    if (value < 0)
                        value = 0;
                    domStyle.set(this.barNode, "width", value + "%");
                    domAttr.set(this.barNode, "aria-valuenow", value.toString());
                }
            },
            error: function(e) {
                console.error("ProgressBarButton.widget.ProgressBarButton updateProgress: XAS error executing microflow" + e);
            }
        }, this);
    }
        
    // call the microflow and remove progress on finishing
    callMicroflow(callback: Function) {
        var self = this;
        mx.data.action({
            params: {
                actionname: this.onClickMicroflow,
                applyto: "selection",
                guids: [this._progressObj.getGuid()]
            },
            context: this.mxcontext,
            async: this.async,
            callback: function() {
                window.clearInterval(self._updatehandler);
                self.progress.remove(self.msgId);
                callback();
            },
            error: function(e) {
                window.clearInterval(self._updatehandler);
                self.progress.remove(self.msgId);
                console.error("ProgressBarButton.widget.ProgressBarButton callMicroflow: XAS error executing microflow " + this.onClickMicroflow + " : " + e);
                callback();
            }
        });
    }
        
    // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
    uninitialize() {
        // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        this._updatehandler && window.clearInterval(this._updatehandler);
        this.cancelBtn && this.cancelBtn.uninitialize();
        this.button && this.button.uninitialize();
    }
}

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
var __ProgressBarButton = dojoDeclare("ProgressBarButton.widget.ProgressBarButton", [_WidgetBase], (function(Source: any) {
    var result: any = {};
    // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
    result.constructor = function() {
        this._progressInterval = 100;
    }
    for (var i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (ProgressBarButton)));

export = ProgressBarButton;