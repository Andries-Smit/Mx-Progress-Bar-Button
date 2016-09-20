import * as React from "ProgressBarButton/lib/react";
// TODO react auto bind
// TODO react pure mixin

export interface IButtonProps {
    ref?: (component: React.Component<IButtonProps, IButtonState>) => React.Component<IButtonProps, IButtonState>;
    caption?: string;
    enabled?: boolean;
    title?: string;
    iconUrl?: string;
    iconClass?: string;
    renderType?: string ;
    onClick?: Function;
    cssStyle?: string;
    cssClasses?: string;
}
export interface IButtonState {
    caption?: string;
    // enabled?: boolean;
}

interface IImageProps {
    iconUrl: string;
}

const Image = ({iconUrl}: IImageProps) =>  iconUrl ? <img src={iconUrl}/> : null;

export default class ButtonView extends React.Component<IButtonProps, IButtonState> {
    public static defaultProps: IButtonProps = {
        cssClasses: "",
        renderType: "button",
    };
    constructor(props: IButtonProps) {
        super(props);
        // set initial state
        this.state = {
            caption: this.props.hasOwnProperty("caption") ? this.props.caption : "",
            // enabled: this.props.hasOwnProperty("enabled") ? this.props.enabled : true,
        };
    }
    public render() {
        let button = this.props;
        if (button.renderType === "link") {
            return (
                <span className={"mx-link " + button.cssClasses}>
                    <a tabIndex={-1} title={button.title} onClick={this.onButonClick}>
                        <Image iconUrl={button.iconUrl} />{" "}{this.props.caption}
                    </a>
                </span>
            );
        } else {
            return (
                <button className={"btn mx-button btn-" + button.renderType + " " + button.cssClasses}
                        disabled={!this.props.enabled}
                        type="button"
                        title={button.title}
                        onClick={this.onButonClick} >
                    <Image iconUrl={button.iconUrl} />{" "}{this.props.caption}
                </button>
            );
        }
     }
     private onButonClick = () => {
         this.props.onClick();
     }
};
