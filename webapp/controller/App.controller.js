sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("zhrmgmtui5.controller.App", {
        onInit: function() {
        },

        getModel : function(sName){
          return sName === "" ? this.getOwnerComponent().getModel() : this.getOwnerComponent().getModel(sName);
        }
      });
    }
  );
  