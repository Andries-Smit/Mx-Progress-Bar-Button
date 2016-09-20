var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ProgressBarButton/lib/react"], function (require, exports, React) {
    "use strict";
    var Image = function (_a) {
        var iconUrl = _a.iconUrl;
        return iconUrl ? React.createElement("img", {src: iconUrl}) : null;
    };
    var ButtonView = (function (_super) {
        __extends(ButtonView, _super);
        function ButtonView(props) {
            var _this = this;
            _super.call(this, props);
            this.onButonClick = function () {
                _this.props.onClick();
            };
            this.state = {
                caption: this.props.hasOwnProperty("caption") ? this.props.caption : "",
            };
        }
        ButtonView.prototype.render = function () {
            var button = this.props;
            if (button.renderType === "link") {
                return (React.createElement("span", {className: "mx-link " + button.cssClasses}, React.createElement("a", {tabIndex: -1, title: button.title, onClick: this.onButonClick}, React.createElement(Image, {iconUrl: button.iconUrl}), " ", this.props.caption)));
            }
            else {
                return (React.createElement("button", {className: "btn mx-button btn-" + button.renderType + " " + button.cssClasses, disabled: !this.props.enabled, type: "button", title: button.title, onClick: this.onButonClick}, React.createElement(Image, {iconUrl: button.iconUrl}), " ", this.props.caption));
            }
        };
        ButtonView.defaultProps = {
            cssClasses: "",
            renderType: "button",
        };
        return ButtonView;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ButtonView;
    ;
});
//# sourceMappingURL=Button.js.map