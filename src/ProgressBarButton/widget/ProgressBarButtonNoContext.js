dojo.require("ProgressBarButton.widget.ProgressBarButton");
// why does require "ProgressBarButton/widget/ProgressBarButton" not working?
require(["dojo/_base/declare"], function (declare) {
    "use strict";
    return declare("ProgressBarButton.widget.ProgressBarButtonNoContext", [ProgressBarButton.widget.ProgressBarButton], {});
});