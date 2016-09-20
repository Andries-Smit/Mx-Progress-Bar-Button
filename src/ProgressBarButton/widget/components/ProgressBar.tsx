
import * as React from "ProgressBarButton/lib/react";

interface IProgressProps extends React.Props<ProgressBar> {
    message?: string;
    progress?: number;
    visable?: boolean;
}

export default class ProgressBar extends React.Component<IProgressProps, {}> {
    public render() {
        let progress = this.props;
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
                        {this.props.children}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
};
