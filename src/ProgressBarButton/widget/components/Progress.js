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
define(["require", "exports", "ProgressBarButton/lib/react", "ProgressBarButton/lib/mobx.umd", "ProgressBarButton/lib/mobx-react", "./Button"], function (require, exports, React, mobx_umd_1, mobx_react_1, Button_1) {
    "use strict";
    var ProgressState = (function () {
        function ProgressState(message, progress, visable, cancelButtonState) {
            this.progress = 0;
            this.visable = false;
            this.message = message;
            this.progress = progress;
            this.visable = visable;
            this.cancelButtonState = cancelButtonState;
        }
        ProgressState.prototype.resetState = function () {
            this.progress = 0;
            this.visable = false;
            if (this.cancelButtonState) {
                this.cancelButtonState.resetState();
            }
        };
        __decorate([
            mobx_umd_1.observable
        ], ProgressState.prototype, "message", void 0);
        __decorate([
            mobx_umd_1.observable
        ], ProgressState.prototype, "progress", void 0);
        __decorate([
            mobx_umd_1.observable
        ], ProgressState.prototype, "visable", void 0);
        return ProgressState;
    }());
    exports.ProgressState = ProgressState;
    var ProgressView = (function (_super) {
        __extends(ProgressView, _super);
        function ProgressView() {
            _super.apply(this, arguments);
        }
        ProgressView.prototype.render = function () {
            var progress = this.props.progressState;
            var cancelButton = progress.cancelButtonState ?
                React.createElement(Button_1.ButtonView, {buttonState: progress.cancelButtonState}) : null;
            if (progress.visable) {
                return (React.createElement("div", {className: "mx-progress withProgressBar"}, React.createElement("div", {className: "mx-progress-message withProgressBar"}, React.createElement("div", {className: "message"}, progress.message), React.createElement("div", {className: "progress progress-striped active"}, React.createElement("div", {className: "progress-bar", style: { width: progress.progress }, role: "progressbar", "aria-valuemin": "0", "aria-valuenow": progress.progress, "aria-valuemax": "100"})), cancelButton)));
            }
            else {
                return null;
            }
        };
        ProgressView = __decorate([
            mobx_react_1.observer
        ], ProgressView);
        return ProgressView;
    }(React.Component));
    exports.ProgressView = ProgressView;
    ;
});
//# sourceMappingURL=Progress.js.map