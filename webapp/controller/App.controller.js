sap.ui.define(
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (BaseController) {
    "use strict";

    return BaseController.extend("zhrmgmtui5.controller.App", {
      onInit: function () {
      },

      getModel: function (sName) {
        return sName === "" ? this.getOwnerComponent().getModel() : this.getOwnerComponent().getModel(sName);
      },

      getRouter: function () {
        return this.getOwnerComponent().getRouter();
      },

      getFilter: function (path, operator, value) {
        return new sap.ui.model.Filter({ path: path, operator: operator, value1: value });
      },

      setProperty: function (property, value) {
        return this.getModel("JSONModel").setProperty(property, value);
      },

      readDataWithParameter: function (sEntitySet, sProperty, oFilters) {
        this.getModel().read(sEntitySet, {
            filters: [oFilters],
            urlParameters: {
                // $expand: parameter
            },
            success: function (oData) {
                debugger;

                // if (oData.results[0].URL) {
                //     if (oData.results[0].URL !== "") {
                //         oData.results[0].URL = "/v2" + oData.results[0].URL;
                //     }
                // }
                oData.results ? this.setProperty(sProperty, oData.results[0]) : this.setProperty(sProperty, oData);
            }.bind(this),
            error: function (oError) {}
        });
    }
    });
  }
);
