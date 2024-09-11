sap.ui.define([
    "./App.controller",
    "sap/m/MessageToast"
],
    function (BaseController, MessageToast) {
        "use strict";

        return BaseController.extend("zhrmgmtui5.controller.View1", {
            onInit: function () {
                this.getModel().setUseBatch(false);
                this.getModel("JSONModel").setProperty("/bVisible", false);
                // this.readModuleDropDown();
            },

            onModuleTypeChange: function (oEvent) {
                debugger;
                var sModule = oEvent.mParameters.selectedItem.getText();
                this.getModel("JSONModel").setProperty("/bVisible", true);
                var oModel = this.getModel();
                oModel.callFunction("/readModule", {
                    urlParameters: {
                        "MODULE_TYPE": sModule
                    },
                    success: function (odata) {
                        this.getModel("JSONModel").setProperty("/Module", odata.results);
                        MessageToast.show("oData Working Properly!")
                    }.bind(this),
                    error: function (error) {
                        MessageToast.show("oData Service Not Working!!")
                    }
                })
            },

            readModuleDropDown: function () {
                var oModel = this.getModel();
                oModel.read("/Module", {
                    success: function (odata) {
                        this.getModel("JSONModel").setProperty("/Module", odata.results)
                        MessageToast.show("oData Working Properly!")
                    }.bind(this),
                    error: function (error) {
                        MessageToast.show("oData Service Not Working!!")
                    }
                })
            },

            onCreateClick: function () {
                debugger;
                if (!this.Dialog) {
                    this.Dialog = sap.ui.xmlfragment("zhrmgmtui5.fragments.create", this);
                    this.getView().addDependent(this.Dialog);
                    this.Dialog.open();
                    sap.ui.getCore().byId("INP_MODULE").setVisible(false);
                }
                else {
                    this.Dialog.open();
                    sap.ui.getCore().byId("INP_ID").setValue("");
                    sap.ui.getCore().byId("INP_NAME").setValue("");
                    sap.ui.getCore().byId("INP_MODULE").setValue("");

                }
            },

            onCancelDialog : function(){
                this.Dialog.close();
                if (this.Dialog) {
                    this.Dialog.destroy();
                    this.Dialog = null;
                }
            },

            dModuleType: function (oEvent) {
                sap.ui.getCore().byId("INP_MODULE").setVisible(true);
                var sModule = oEvent.mParameters.selectedItem.getText();
                var oModel = this.getModel();
                oModel.callFunction("/readModule", {
                    urlParameters: {
                        "MODULE_TYPE": sModule
                    },
                    success: function (odata) {
                        this.getModel("JSONModel").setProperty("/DialogModule", odata.results);
                    }.bind(this),
                    error: function (error) {
                        MessageToast.show("oData Service Not Working!!")
                    }
                });

            },

            handleDialogUploadPress : function(oEvent){
                debugger;
            },


        });
    });
