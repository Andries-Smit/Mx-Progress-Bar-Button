import * as React from "ProgressBarButton/lib/react";
import {observable} from "ProgressBarButton/lib/mobx.umd";
import {observer} from "ProgressBarButton/lib/mobx-react";

export class ButtonState {
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

    public resetState() {
        this.enabled = true;
    }
}

@observer
export class ButtonView extends React.Component<{buttonState: ButtonState}, {}> {
    public render() {
        let button = this.props.buttonState;
        let image = button.iconUrl ? <img src={button.iconUrl}/> : null;
        if (button.renderType === "link") {
            return (
                <span className={"mx-link " + button.cssClasses}>
                    <a tabIndex={-1} title={button.title} onClick={this.onButonClick}>
                        {image} {button.caption}
                    </a>
                </span>
            );
        } else {
            return (
                <button className={"btn mx-button btn-" + button.renderType + " " + button.cssClasses}
                        disabled={!button.enabled}
                        type="button"
                        title={button.title}
                        onClick={this.onButonClick} >
                    {image} {button.caption}
                </button>
            );
        }
     }
     private onButonClick = () => {
         this.props.buttonState.onClick();
     }
};
