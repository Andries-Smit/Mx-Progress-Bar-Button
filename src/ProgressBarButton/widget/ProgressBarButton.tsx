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
import * as dojoLang from "dojo/_base/lang";
import * as mxLang from "mendix/lang";

import * as React from "ProgressBarButton/lib/react";
import ReactDOM = require("ProgressBarButton/lib/react-dom");
import {observable, transaction} from "ProgressBarButton/lib/mobx.umd";
import {observer} from "ProgressBarButton/lib/mobx-react";
// import DevTools from "ProgressBarButton/lib/mobx-react-devtools";

class ProgressState {
    @observable public message: string;
    @observable public progress: number;
    @observable public visable: boolean;
    public cancelButtonState: ButtonState;

    constructor (message: string, progress: number, visable: boolean, cancelButtonState?: ButtonState) {
        this.message = message;
        this.progress = progress;
        this.visable = visable;
        this.cancelButtonState = cancelButtonState;
    }
}

@observer
class ProgressView extends React.Component<{progressState: ProgressState}, {}> {
    private cancelButton = this.props.progressState.cancelButtonState ?
        <ButtonView buttonState={this.props.progressState.cancelButtonState}/> : null;
    public render() {
        if (this.props.progressState.visable) {
            return (
                <div className="mx-progress withProgressBar">
                    <div className="mx-progress-message withProgressBar">
                        <div className="message">{this.props.progressState.message}</div>
                        <div className="progress progress-striped active">
                            <div className="progress-bar"
                                style={this.withStyle(this.props.progressState.progress)}
                                role="progressbar"
                                aria-valuemin="0"
                                aria-valuenow={this.props.progressState.progress}
                                aria-valuemax="100" />
                        </div>
                        {this.cancelButton}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
    private withStyle(progress: number) {
        return {width: progress + "%"};
    }
};

class ButtonState {
    @observable public caption: string;
    @observable public enabled = true;
    public title: string;
    public iconUrl: string;
    public iconClass: string;
    public renderType: string;
    public onClick: Function;
    public cssStyle: string;
    public cssClasses: string;
    constructor(caption: string, title: string,  iconUrl: string, renderType: string, onClick: Function, cssClasses: string) {
        this.caption = caption;
        this.title = title;
        this.iconUrl = iconUrl;
        this.renderType = renderType;
        this.onClick = onClick;
        this.cssClasses = cssClasses;
    }
}

@observer
class ButtonView extends React.Component<{buttonState: ButtonState}, {}> {
    private image = this.props.buttonState.iconUrl ? <img src={this.props.buttonState.iconUrl}/> : null;
    public render() {
        if (this.props.buttonState.renderType === "link") {
            return (
                <span className={"mx-link " + this.props.buttonState.cssClasses}>
                    <a tabIndex={-1} title={this.props.buttonState.title} onClick={this.onButonClick}>
                        {this.image} {this.props.buttonState.caption}
                    </a>
                </span>
            );
        } else {
            return (
                <button className={"btn mx-button btn-" + this.props.buttonState.renderType + " " + this.props.buttonState.cssClasses}
                        disabled={!this.props.buttonState.enabled}
                        type="button"
                        title={this.props.buttonState.title}
                        onClick={this.onButonClick} >
                    {this.image} {this.props.buttonState.caption}
                </button>
            );
        }
     }
     private onButonClick = () => {
         this.props.buttonState.onClick();
     }
};

class ProgressBarButton extends _WidgetBase {
    // Parameters configured in the Modeler
    public title: string;
    private caption: string;
    private captionAtt: string;
    private icon: string;
    private buttonStyle: string;
    private onClickMicroflow: string;
    private progressEntity: string;
    private progressMessage: string;
    private progressMessageAtt: string;
    private progressPercentAtt: string;
    private cancelingCaption: string;
    private processCancel: string;
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
    private progressObj: mendix.lib.MxObject;
    private progressInterval: number;
    private updatehandler: number;
    private progressState: ProgressState;
    private buttonState: ButtonState;
    private cancelButtonState: ButtonState;
    private handles: any[];

    // The TypeScript Contructor, not the dojo consctuctor, move contructor work into widget prototype at bottom of the page. 
    constructor(args?: Object, elem?: HTMLElement) {
        // Do not add any default value here... it wil not run in dojo!     
        super() ;
        return new dojoProgressBarButton(args, elem);
    }
    // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
    public postCreate() {
        logger.debug(this.id + ".postCreate");
        this.buttonState =  new ButtonState(this.caption, this.title, this.icon, this.buttonStyle.toLowerCase(), dojoLang.hitch(this, this.onclickEvent), "");
        if (this.cancelMicroflow) {
            this.cancelButtonState = new ButtonState(this.processCancel, null, null, "default", dojoLang.hitch(this, this.onclickCancel), "progressCancelBrn");
        }
        this.progressState = new ProgressState("About to start", 0, false, this.cancelButtonState);
        ReactDOM.render(
            <div>
                <ButtonView buttonState={this.buttonState} />
                <ProgressView progressState={this.progressState} />
            </div>, this.domNode);
        this.contextObj = null;
        this.progressObj = null;
    }
    // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
    public update(obj: mendix.lib.MxObject, callback: Function) {
        logger.debug(this.id + ".update");
        this.contextObj = obj;
        transaction(() => {
            if (obj) {
                this.buttonState.enabled = true;
            } else {
                this.buttonState.enabled = false;
            }
            if (obj && this.captionAtt) {
                    this.buttonState.caption = String(obj.get(this.captionAtt));
            } else {
                this.buttonState.caption = this.caption;
            }
        });
        this._resetSubscriptions();
        if (callback) {
            callback();
        }
    }
    // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
    public uninitialize() {
        logger.debug(this.id + ".uninitialize");
        // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
        ReactDOM.unmountComponentAtNode(this.domNode);
        if (this.updatehandler) {
            clearInterval(this.updatehandler);
        }
    }
    // onclick Event is called when the button is clicked, doing asyc sequesnce:
    // confirmation, validation, saving, show progress, call microlow
    private onclickEvent() {
        logger.debug(this.id + ".onclickEvent");
        let callFunctions: Function[] = [];
        if (this.confirm) {
            callFunctions.push(this.doConfirmation);
        }
        if (this.validate === true) {
            callFunctions.push(dojoLang.hitch(this.mxform, this.mxform.validate));
        }
        callFunctions.push((callback) => {
            this.mxform.save(callback, (error) => {
                if (!(error instanceof mendix.lib.ValidationError)) {
                    mx.onError(error);
                }
            });
        });
        if (this.progressObj === null) {
            callFunctions.push(this.createProgressObject);
        }
        callFunctions.push(this.showProgress);
        callFunctions.push( this.callMicroflow );
        mxLang.sequence(callFunctions, null, this);
    }

    // Creates a progress object which is used for communication progress betwean server and web UI        
    private createProgressObject(callback) {
        logger.debug(this.id + ".createProgressObject");
        mx.data.create({
            callback: (obj) => {
                this.progressObj = obj;
                if (callback) {
                    callback();
                }
            },
            entity: this.progressEntity,
            error: (e) => {
                console.error("ProgressBarButton.widget.ProgressBarButton createProgressObject; an error occured creating " + this.progressEntity + " :" + e);
            },
        });
    }

    // Show a progress dialog for confirmation.
    private doConfirmation(cb) {
        logger.debug(this.id + ".doConfirmation", this.conQuestion, this.conProceed, this.conCancel);
        mx.ui.confirmation({
            cancel: this.conCancel,
            content: this.conQuestion,
            handler: cb,
            proceed: this.conProceed,
        });
    }
    // show the progressbar
    private showProgress(callback) {
        logger.debug(this.id + ".showProgress");
        if (this.blocking) {
             mx.ui.showUnderlay();
        }
        transaction(() => {
            this.buttonState.enabled = false;
            this.progressState.message = this.progressMessage;
            this.progressState.progress = 0;
            this.progressState.visable = true;
        });
        this.updatehandler = setInterval(() => this.updateProgress(), this.progressInterval);
        callback();
    }
    // start canceling thensaction.
    private onclickCancel() {
        logger.debug(this.id + ".onclickCancel " + this.cancelMicroflow);
        this.progressState.message = this.cancelingCaption;
        this.cancelButtonState.enabled = false;
        this.progressObj.set(this.progressMessageAtt, this.cancelingCaption);
        mx.data.action({
            callback: () => {
                logger.debug(this.id + ".onclickCancel callback");
            },
            error: (e) => {
                this.cancelButtonState.enabled = true;
                console.error(this.id + ".onclickCancel Cancel Progress: XAS error executing microflow " + this.cancelMicroflow, e);
                mx.ui.error(e);
            },
            params: {
                actionname: this.cancelMicroflow,
                applyto: "selection",
                guids: [this.progressObj.getGuid()],
            },
        });
    }
    // update the progress messages and bar. 
    private updateProgress() {
        logger.debug(this.id + ".updateProgress");
        mx.data.get({
            callback: (objs) => {
                if (objs && objs.length > 0) {
                    let obj = objs[0];
                    let value = Math.round(obj.get(this.progressPercentAtt));
                    if (value > 100) {
                        value = 100;
                    }
                    if (value < 0) {
                        value = 0;
                    }
                    transaction(() => {
                        this.progressState.message = this.progressMessage + obj.get(this.progressMessageAtt);
                        this.progressState.progress = value;
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

    // call the microflow and remove progress on finishing
    private callMicroflow(callback: Function) {
        logger.debug(this.id + ".callMicroflow");
        mx.data.action({
            async: this.async,
            callback: () => {
                clearInterval(this.updatehandler);
                transaction(() => {
                    this.cancelButtonState.enabled = true;
                    this.buttonState.enabled = true;
                    this.progressState.visable = false;
                });
                if (this.blocking) {
                    mx.ui.hideUnderlay();
                }
                callback();
            },
            context: this.mxcontext,
            error: (e) => {
                clearInterval(this.updatehandler);
                transaction(() => {
                    this.cancelButtonState.enabled = true;
                    this.buttonState.enabled = true;
                    this.progressState.visable = false;
                });
                if (this.blocking) {
                    mx.ui.hideUnderlay();
                }
                console.error(this.id + ".callMicroflow : XAS error executing microflow " + this.onClickMicroflow + " : " + e);
                mx.ui.error(e);
                callback();
            },
            params: {
                actionname: this.onClickMicroflow,
                applyto: "selection",
                guids: [this.progressObj.getGuid()],
            },
        });
    }
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
                    this.buttonState.caption = attrValue;
                },
                guid: this.contextObj.getGuid(),
            });
            this.handles = [attrHandle];
        }
        /*
         var objectHandle = mx.data.subscribe({
                guid: this.contextObj.getGuid(),
                callback: () => {
                    this._updateRendering();
                }
            }); 
         */
    }
}

// Declare widget's prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
let dojoProgressBarButton = dojoDeclare("ProgressBarButton.widget.ProgressBarButton", [_WidgetBase], (function(Source: any) {
    let result: any = {};
    // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
    result.constructor = function() {
        logger.debug( this.id + ".constructor");
        this.progressInterval = 100;
    };
    for (let i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
} (ProgressBarButton)));

export = ProgressBarButton;
