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
        return new Promise(function (resolve, reject) {
          this.getModel().read(sEntitySet, {
            filters: [oFilters],
            success: function (oData) {
              oData.results ? this.setProperty(sProperty, oData.results[0]) : this.setProperty(sProperty, oData);
              resolve(oData);
            }.bind(this),
            error: function (oError) { }
          });
        }.bind(this));
      }
    });
  }
);
