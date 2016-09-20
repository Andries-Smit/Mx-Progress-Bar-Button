declare module ProgressBarButton {
    
	export interface IProps{        
        caption: string;
        title: string;
        image: string;
        buttonStyle: "default" | "primary" | "success" | "info" | "warning" | "danger" | "link";
        cancelMicroflow: string;
        processCancel: string;
        cancelingCaption: string;
        async: boolean;
        blocking: boolean;
        validate: boolean;
        progressMessage: string;
        confirm: boolean;
        conQuestion: string;
        conProceed: string;
        conCancel: string;
    }
    export interface IState{
        context: {
            captionAtt: string;
        };
        progressEntity: {
            progressMessageAtt: string;
            progressPercentAtt: number
        }
    }

}