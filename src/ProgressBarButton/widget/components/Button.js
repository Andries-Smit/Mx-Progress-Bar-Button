var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "ProgressBarButton/lib/react", "ProgressBarButton/lib/mobx.umd", "ProgressBarButton/lib/mobx-react"], function (require, exports, React, mobx_umd_1, mobx_react_1) {
    "use strict";
    var ButtonState = (function () {
        function ButtonState(caption, title, iconUrl, renderType, onClick, cssClasses) {
            this.enabled = true;
            this.caption = caption;
            this.title = title;
            this.iconUrl = iconUrl;
            this.renderType = renderType;
            this.onClick = onClick;
            this.cssClasses = cssClasses;
        }
        ButtonState.prototype.resetState = function () {
            this.enabled = true;
        };
        __decorate([
            mobx_umd_1.observable
        ], ButtonState.prototype, "caption", void 0);
        __decorate([
            mobx_umd_1.observable
        ], ButtonState.prototype, "enabled", void 0);
        return ButtonState;
    }());
    exports.ButtonState = ButtonState;
    var ButtonView = (function (_super) {
        __extends(ButtonView, _super);
        function ButtonView() {
            var _this = this;
            _super.apply(this, arguments);
            this.onButonClick = function () {
                _this.props.buttonState.onClick();
            };
        }
        ButtonView.prototype.render = function () {
            var button = this.props.buttonState;
            var image = button.iconUrl ? React.createElement("img", {src: button.iconUrl}) : null;
            if (button.renderType === "link") {
                return (React.createElement("span", {className: "mx-link " + button.cssClasses}, React.createElement("a", {tabIndex: -1, title: button.title, onClick: this.onButonClick}, image, " ", button.caption)));
            }
            else {
                return (React.createElement("button", {className: "btn mx-button btn-" + button.renderType + " " + button.cssClasses, disabled: !button.enabled, type: "button", title: button.title, onClick: this.onButonClick}, image, " ", button.caption));
            }
        };
        ButtonView = __decorate([
            mobx_react_1.observer
        ], ButtonView);
        return ButtonView;
    }(React.Component));
    exports.ButtonView = ButtonView;
    ;
});
//# sourceMappingURL=Button.js.map