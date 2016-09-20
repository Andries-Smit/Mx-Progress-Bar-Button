import * as React from "ProgressBarButton/lib/react";
import {observable} from "ProgressBarButton/lib/mobx.umd";
import {observer} from "ProgressBarButton/lib/mobx-react";
import {ButtonView, ButtonState} from "./Button";

export class ProgressState {
    @observable public message: string;
    @observable public progress: number = 0;
    @observable public visable: boolean = false;
    public cancelButtonState: ButtonState;

    constructor (message: string, progress: number, visable: boolean, cancelButtonState?: ButtonState) {
        this.message = message;
        this.progress = progress;
        this.visable = visable;
        this.cancelButtonState = cancelButtonState;
    }

    public resetState() {
        this.progress = 0;
        this.visable = false;
        if (this.cancelButtonState) {
            this.cancelButtonState.resetState();
        }
    }
}

@observer
export class ProgressView extends React.Component<{progressState: ProgressState}, {}> {
    public render() {
        let progress = this.props.progressState;
        let cancelButton = progress.cancelButtonState ?
        <ButtonView buttonState={progress.cancelButtonState}/> : null;
        if (progress.visable) {
            return (
                <div className="mx-progress withProgressBar">
                    <div className="mx-progress-message withProgressBar">
                        <div className="message">{progress.message}</div>
                        <div className="progress progress-striped active">
                            <div className="progress-bar"
                                style={{width : progress.progress}}
                                role="progressbar"
                                aria-valuemin="0"
                                aria-valuenow={progress.progress}
                                aria-valuemax="100" />
                        </div>
                        {cancelButton}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
};
