

/*
 ProgressBarButton
 ========================
 
 @file      : ProgressBarButton.js
 @version   : 1.3.0
 @author    : Andries Smit
 @date      : Wed, 28 Jun 2016
 @copyright : Flock of Birds Int BV
 @license   : Apache License V2.0
 
 Documentation
 ========================
 A microflow button widget that shows progress messages and a progress bar 
 during the  processing of microflows. In the MF the messages and percentage 
 can be updated and are show to the user directly. 
 */

declare var mx: mx.mx;
declare var logger: mendix.logger;

import * as dojoDeclare from "dojo/_base/declare";
import * as _WidgetBase from  "mxui/widget/_WidgetBase";
import * as mxLang from "mendix/lang";

import * as React from "ProgressBarButton/lib/react";
import ReactDOM = require("ProgressBarButton/lib/react-dom");
import {ProgressBarButton, IProgressBarButtonState, IProgressBarButtonProps} from "./components/ProgressBarButton";

export class ProgressBarButtonWrapper extends _WidgetBase {
    // Parameters configured in the Modeler
    public title: string;
    public progressObj: mendix.lib.MxObject; //  have not so nice, but have to share object with child nodes...
    private caption: string;
    private captionAtt: string;
    private icon: string;
    private buttonStyle: string;
    private onClickMicroflow: string;
    private processCancel: string;
    private progressEntity: string;
    private progressMessage: string;
    private progressMessageAtt: string;
    private progressPercentAtt: string;
    private cancelingCaption: string;
    private cancelMicroflow: string;
    private confirm: boolean;
    private async: boolean;
    private validate: boolean;
    private blocking: boolean;
    private conQuestion: string;
    private conProceed: string;
    private conCancel: string;
    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    private contextObj: mendix.lib.MxObject;
    private handles: number[];
    private progressBarButtonComponent: React.Component<IProgressBarButtonProps, IProgressBarButtonState>;

    // The TypeScript Contructor, not the dojo consctuctor, move contructor work into widget prototype at bottom of the page. 
    constructor(args?: Object, elem?: HTMLElement) {
        // Do not add any default value here... it wil not run in dojo!     
        super() ;
        return new dojoProgressBarButton(args, elem);
    }
    public createProps() {
        return { // TODO group properties on function like button.
            async: this.async,
            blocking: this.blocking,
            buttonStyle: this.buttonStyle,
            cancelMicroflow: this.cancelMicroflow,
            cancelingCaption: this.cancelingCaption,
            caption: this.caption,
            conCancel: this.conCancel,
            conProceed: this.conProceed,
            conQuestion: this.conQuestion,
            confirm: this.confirm,
            icon: this.icon,
            onClickMicroflow: this.onClickMicroflow,
            processCancel: this.processCancel,
            progressEntity: this.progressEntity,
            progressMessage: this.progressMessage,
            title: this.title,
            validate: this.validate,
        };
    }
    // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
    public postCreate() {
        logger.debug(this.id + ".postCreate !");

        this.mxUpdateProgressObject = this.mxUpdateProgressObject.bind(this);
        this.mxCreateProgressObject = this.mxCreateProgressObject.bind(this);
        this.formSave = this.formSave.bind(this);
        this.formValidate = this.formValidate.bind(this);
        ReactDOM.render(
            <ProgressBarButton
                widgetId={this.id} {...this.createProps()}
                ref={(c) => this.progressBarButtonComponent = c}
                wrapper={this}
                />, this.domNode
        );
        this.contextObj = null;
        this.progressObj = null;
    }
    // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
    public update(obj: mendix.lib.MxObject, callback?: Function) {
        logger.debug(this.id + ".update");
        this.contextObj = obj;

        this.updateStore(callback);
        this._resetSubscriptions();
    }
    // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
    public uninitialize() {
        logger.debug(this.id + ".uninitialize");
        // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        ReactDOM.unmountComponentAtNode(this.domNode);
        this._unsubscribe();
    }
    public mxUpdateProgressObject() {
        logger.debug(this.id + ".updateProgress");
        mx.data.get({
            callback: (objs: mendix.lib.MxObject[]) => {
                if (objs && objs.length > 0) {
                    let obj = objs[0];
                    let msg = String(obj.get(this.progressMessageAtt));
                    let percent = Number(obj.get(this.progressPercentAtt));
                    this.progressBarButtonComponent.setState({
                        progressEntity: {
                            progressMessageAtt: msg,
                            progressPercentAtt: percent,
                        },
                    });
                }
            },
            error: (e) => {
                console.error(this.id + ".updateProgress: XAS error retreiving progress object", e);
            },
            guids: [this.progressObj.getGuid()],
            noCache: true,
        });
    }
    public formSave(callback?: Function) {
        this.mxform.save(callback, (error) => {
            if (!(error instanceof mendix.lib.ValidationError)) {
                mx.onError(error);
            }
        });
    }
    public formValidate(callback?: Function) {
        this.mxform.validate.bind(this.mxform);
        this.mxform.validate(callback);
    }
    // Creates a progress object which is used for communication progress betwean server and web UI        
    public mxCreateProgressObject(callback: Function) {
        logger.debug(this.id + ".createProgressObject");
        mx.data.create({
            callback: (obj) => {
                this.progressObj = obj;
                this.progressBarButtonComponent.setState({
                        progressEntity: {
                            guid: String(obj.getGuid()),
                            progressMessageAtt: String(obj.get(this.progressMessageAtt)),
                            progressPercentAtt: Number(obj.get(this.progressPercentAtt)),
                        },
                    });
                if (callback) { // TODO check if callback should happen in callback of set state
                    callback();
                }
            },
            entity: this.progressEntity,
            error: (e) => {
                console.error("ProgressBarButton.widget.ProgressBarButton createProgressObject; an error occured creating " + this.progressEntity + " :", e);
            },
        });
    }
    // Set store value, could trigger a rerender the interface.
    private updateStore (callback?: Function) {
        logger.debug(this.id + ".updateRendering");
        if (this.contextObj) {
            this.progressBarButtonComponent.setState({enabled: true});
        } else {
            this.progressBarButtonComponent.setState({enabled: false});
        }
        if (this.contextObj && this.captionAtt) {
            this.progressBarButtonComponent.setState({
                context: { captionAtt: String(this.contextObj.get(this.captionAtt))},
            });
        } else {
            this.progressBarButtonComponent.setState({
                context: { captionAtt: this.caption},
            });
        }
        // The callback, coming from update, needs to be executed, to let the page know it finished rendering
        mxLang.nullExec(callback);
    }
    // update the progress messages and bar. 
    private updateProgress() {
        logger.debug(this.id + ".updateProgress");
        mx.data.get({
            callback: (objs: mendix.lib.MxObject[]) => {
                if (objs && objs.length > 0) {
                    let obj = objs[0];
                    this.progressBarButtonComponent.setState({
                        progressEntity: {
                            progressMessageAtt: String(obj.get(this.progressMessageAtt)),
                            progressPercentAtt: Number(obj.get(this.progressPercentAtt)),
                        },
                    });
                }
            },
            error: (e) => {
                console.error(this.id + ".updateProgress: XAS error retreiving progress object", e);
            },
            guids: [this.progressObj.getGuid()],
            noCache: true,
        });
    }
    // Remove subscriptions
    private _unsubscribe () {
        if (this.handles) {
            for (let handle of this.handles) {
                mx.data.unsubscribe(handle);
            }
            this.handles = [];
        }
    }
    // Reset subscriptions.
    private _resetSubscriptions () {
        logger.debug(this.id + "._resetSubscriptions");
        // Release handles on previous object, if any.
        this._unsubscribe();
        // When a mendix object exists create subscribtions.
        if (this.contextObj && this.captionAtt) {
            let attrHandle = mx.data.subscribe({
                attr: this.captionAtt,
                callback: (guid, attr, attrValue) => {
                    logger.debug(this.id + "._resetSubscriptions attribute '" + attr + "' subscription update MxId " + guid);
                    this.updateStore();
                },
                guid: this.contextObj.getGuid(),
            });
            let objectHandle = mx.data.subscribe({
                callback: (guid) => {
                    logger.debug(this.id + "._resetSubscriptions object subscription update MxId " + guid);
                    this.updateStore();
                },
                guid: this.contextObj.getGuid(),
            });
            this.handles = [attrHandle, objectHandle];
        }
    }
}

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
let dojoProgressBarButton = dojoDeclare("ProgressBarButton.widget.ProgressBarButton", [_WidgetBase], (function(Source: any) {
    let result: any = {};
    // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
    result.constructor = function() {
        logger.debug( this.id + ".constructor dojo");
        this.progressInterval = 100;
    };
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (ProgressBarButtonWrapper)));

export default ProgressBarButtonWrapper;
