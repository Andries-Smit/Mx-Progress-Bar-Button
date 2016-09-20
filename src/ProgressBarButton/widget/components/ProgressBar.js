var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "ProgressBarButton/lib/react"], function (require, exports, React) {
    "use strict";
    var ProgressBar = (function (_super) {
        __extends(ProgressBar, _super);
        function ProgressBar() {
            _super.apply(this, arguments);
        }
        ProgressBar.prototype.render = function () {
            var progress = this.props;
            if (progress.visable) {
                return (React.createElement("div", {className: "mx-progress withProgressBar"}, React.createElement("div", {className: "mx-progress-message withProgressBar"}, React.createElement("div", {className: "message"}, progress.message), React.createElement("div", {className: "progress progress-striped active"}, React.createElement("div", {className: "progress-bar", style: { width: progress.progress }, role: "progressbar", "aria-valuemin": "0", "aria-valuenow": progress.progress, "aria-valuemax": "100"})), this.props.children)));
            }
            else {
                return null;
            }
        };
        return ProgressBar;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ProgressBar;
    ;
});
//# sourceMappingURL=ProgressBar.js.map