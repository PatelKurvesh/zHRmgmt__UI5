sap.ui.define([
    "./App.controller",
    "sap/ui/model/json/JSONModel",
    "../model/models"
],
    function (BaseController, JSONModel, Models) {
        "use strict";

        return BaseController.extend("zhrmgmtui5.controller.Detail", {

            onInit: function () {
                this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function () {
                sap.ui.core.BusyIndicator.hide()
            },

        });
    });