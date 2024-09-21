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

      getFilter: function (path, operator, value) {
        return new sap.ui.model.Filter({ path: path, operator: operator, value1: value });
      },

      readDataWithParameter: function (sEntitySet, sProperty, oFilters, expandParams) {
        return new Promise(function (resolve, reject) {
          this.getModel().read(sEntitySet, {
            filters: [oFilters],
            urlParameters: {
              "$expand": expandParams
            },
            success: function (oData) {
              oData.results[0].createdAt = oData.results[0].createdAt.toISOString();
              oData.results ? this.setProperty(sProperty, oData.results[0]) : this.setProperty(sProperty, oData);
              
              resolve(oData);
              if (!jQuery.isEmptyObject(oData.results[0].EMP_CV)) {
                this.setProperty("/Resume", [oData.results[0].EMP_CV]);
              } else {
                this.setProperty("/Resume", null);
              }
              if (!jQuery.isEmptyObject(oData.results[0].EMP_PRJ)) {
                this.setProperty("/Project", oData.results[0].EMP_PRJ.results);
              } else {
                this.setProperty("/Project", null);
              }
            }.bind(this),
            error: function (oError) { }
          });
        }.bind(this));
      }
    });
  }
);
