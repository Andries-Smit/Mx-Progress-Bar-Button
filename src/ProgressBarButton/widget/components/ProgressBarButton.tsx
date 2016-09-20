import * as React from "ProgressBarButton/lib/react";

declare var mx: mx.mx;
declare var logger: mendix.logger;
import * as mxLang from "mendix/lang";


import ProgressBarButtonWrapper from "./../ProgressBarButton"; // Wrapper
import Button from "./Button";
import ProgressBar from "./ProgressBar";

interface IProgressBarButtonModelProps { // Would be great if model props can be generated from widget.xml, including documentation.
    widgetId: string;
    caption?: string;
    title?: string;
    icon?: string;
    buttonStyle: string; // "default" | "primary" | "success" | "info" | "warning" | "danger" | "link";
    onClickMicroflow?: string;
    cancelMicroflow?: string;
    processCancel?: string;
    cancelingCaption?: string;
    async: boolean;
    blocking: boolean;
    validate: boolean;
    progressMessage?: string;
    confirm: boolean;
    conQuestion?: string;
    conProceed?: string;
    conCancel?: string;
}
// Custom props 
export interface IProgressBarButtonProps extends IProgressBarButtonModelProps {
    // helper props for MX / dojo   
    wrapper? : ProgressBarButtonWrapper;
    ref?: (component: React.Component<IProgressBarButtonProps, IProgressBarButtonModelState>) => React.Component<IProgressBarButtonProps, IProgressBarButtonModelState>;
    // formValidate?: Function;
    // formSave?: Function;
    // mxcontext?: any; // TODO Future not context aware? mxCallMicrfolowWithContext() 
    // mxUpdateProgressObject?: Function;
    // mxCreateProgressObject?: Function;
}
// Props that are derived from model
interface IProgressBarButtonModelState {
    context?: {
        guid?: string;
        captionAtt?: string;
    };
    progressEntity?: {
        guid?: string;
        isLoaded?: boolean;
        progressMessageAtt?: string;
        progressPercentAtt?: number
    };
}

// intarnal state
export interface IProgressBarButtonState extends IProgressBarButtonModelState {
    isCanceling?: boolean;
    isRunning?: boolean;
    progressMessage?: string;
    enabled?: boolean;
    // progress:
}

export class ProgressBarButton extends React.Component<IProgressBarButtonProps, IProgressBarButtonState> {
    public static defaultProps: IProgressBarButtonProps = {
        async: false,
        blocking: true,
        buttonStyle: "default",
        confirm: false,
        progressMessage: "",
        validate: false,
        widgetId: "undefined",
    };
    private updatehandler: number;
    private progressInterval: number = 100;
    private hasCancelButton: boolean = false;
    constructor(props: IProgressBarButtonProps) {
        super(props);
        // set initial state
        this.state = {
            context: {},
            isCanceling: false,
            isRunning: false,
            progressEntity: {
                progressMessageAtt: "",
                progressPercentAtt: 0,
            },
            progressMessage: this.props.progressMessage ? this.props.progressMessage : "",
        };
        this.onButonClick = this.onButonClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
    }
    public componentWillUnmount () {
        logger.debug(this.props.widgetId + " .componentWillUnmount");
        if (this.updatehandler) {
            clearInterval(this.updatehandler);
        }
    }
    public render() {
        logger.debug(this.props.widgetId + ".render");
        return (
            <div>
                <Button
                    caption={this.state.context.captionAtt}
                    title={this.props.title}
                    iconUrl={this.props.icon}
                    renderType={this.props.buttonStyle.toLowerCase()}
                    onClick={this.onButonClick}
                    enabled={!this.state.isRunning && this.state.enabled}
                />
                <ProgressBar
                    message={!this.state.isCanceling ?
                        this.props.progressMessage +  this.state.progressEntity.progressMessageAtt:
                        this.props.cancelingCaption}
                    progress={this.getProgress()}
                    visable={this.state.isRunning}>
                        {this.getCancelButton()}
                </ProgressBar>
            </div>
        );
     }
     private getProgress() {
        logger.debug(this.props.widgetId + ".getProgress");
        let value = Math.round(this.state.progressEntity.progressPercentAtt);
        if (value > 100) {
            value = 100;
        }
        if (value < 0) {
            value = 0;
        }
        return value;
     }
     private getCancelButton() {
        logger.debug(this.props.widgetId + ".getCancelButton");
        if (this.props.cancelMicroflow) {
            this.hasCancelButton = true;
            return (
                <Button
                    caption={this.props.processCancel}
                    onClick={this.onCancelClick}
                    cssClasses={"progressCancelBtn"}
                    enabled={!this.state.isCanceling}
                />
            );
        }
        return null;
    }
    // start canceling the transaction.
     private onCancelClick() {
        logger.debug(this.props.widgetId + ".onCancelClick");
        this.setState({
            isCanceling: true,
            // progressMessage: this.props.cancelingCaption,
        });
        mx.data.action({
            callback: () => {
                logger.debug(this.props.widgetId + ".onclickCancel callback");
            },
            error: (e) => {
                this.setState({
                    isCanceling: false,
                });
                console.error(this.props.widgetId + ".onclickCancel Cancel Progress: XAS error executing microflow " + this.props.cancelMicroflow, e);
                mx.ui.error(e.message);
            },
            params: {
                actionname: this.props.cancelMicroflow,
                applyto: "selection",
                guids: [this.props.wrapper.progressObj.getGuid()],
            },
        });
     }
     private onButonClick() {
        logger.debug(this.props.widgetId + ".onButonClick");
        let callFunctions: Function[] = [];
        if (this.props.confirm) {
            callFunctions.push(this.doConfirmation);
        }
        if (this.props.validate === true) {
            callFunctions.push(this.props.wrapper.formValidate);
        }
        callFunctions.push(this.props.wrapper.formSave);
        if (!this.state.progressEntity.isLoaded) {
            callFunctions.push(this.props.wrapper.mxCreateProgressObject);
        }
        callFunctions.push(this.showProgress);
        callFunctions.push(this.callMicroflow);
        mxLang.sequence(callFunctions, null, this);
     }
     // Show a progress dialog for confirmation.
    private doConfirmation(cb: Function) {
        logger.debug(this.props.widgetId + ".doConfirmation", this.props.conQuestion, this.props.conProceed, this.props.conCancel);
        mx.ui.confirmation({
            cancel: this.props.conCancel,
            content: this.props.conQuestion,
            handler: cb,
            proceed: this.props.conProceed,
        });
    }
    // show the progressbar
    private showProgress(callback: Function) {
        logger.debug(this.props.widgetId + ".showProgress");
        if (this.props.blocking) {
             mx.ui.showUnderlay();
        }
        this.setState({
            isCanceling: false,
            isRunning: true,
            progressEntity: {
                progressMessageAtt: "",
                progressPercentAtt: 0,
            },
        });
        this.updatehandler = setInterval(() => this.updateProgress(), this.progressInterval);
        callback();
    }
    // call the microflow and remove progress on finishing
    private callMicroflow(callback: Function) {
        logger.debug(this.props.widgetId + ".callMicroflow");
        // if (this.props.wrapper.progressObj) {
        mx.data.action({
            async: this.props.async,
            callback: () => {
                clearInterval(this.updatehandler);
                this.setState({isRunning: false});
                if (this.props.blocking) {
                    mx.ui.hideUnderlay();
                }
                callback();
            },
            context: this.props.wrapper.mxcontext,
            error: (e) => {
                clearInterval(this.updatehandler);
                this.setState({isRunning: false});
                if (this.props.blocking) {
                    mx.ui.hideUnderlay();
                }
                console.error(this.props.widgetId + ".callMicroflow : XAS error executing microflow " + this.props.onClickMicroflow + " : " + e);
                mx.ui.error(e.message);
                callback();
            },
            params: {
                actionname: this.props.onClickMicroflow,
                applyto: "selection",
                guids: [this.props.wrapper.progressObj.getGuid()],
            },
        });
        // }
    }
    // update the progress messages and bar. 
    private updateProgress() {
        logger.debug(this.props.widgetId + ".updateProgress");
        this.props.wrapper.mxUpdateProgressObject();
    }
};

export default ProgressBarButton;
