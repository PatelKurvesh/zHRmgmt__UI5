sap.ui.define([
    "./App.controller",
    "sap/m/MessageToast",
    "../model/models"
],
    function (BaseController, MessageToast, Models) {
        "use strict";

        return BaseController.extend("zhrmgmtui5.controller.View1", {
            onInit: function () {
                this.getModel().setUseBatch(false);
                this.getModel("JSONModel").setProperty("/bVisible", false);
                this.readEmployee();
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

            readEmployee: function () {
                var oModel = this.getModel();
                oModel.read("/EMPLOYEE", {
                    success: function (oData) {
                        debugger;
                        this.getModel("JSONModel").setProperty("/Employee", oData.results);

                    }.bind(this),
                    error: function (error) {

                    }
                })
            },

            onCreateClick: function () {
                if (!this.Dialog) {
                    var oEmployeePayload = Models._createNewEmployee();
                    this.getModel("JSONModel").setProperty("/CreateEmployee", oEmployeePayload);
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

            onCancelDialog: function () {
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

            onAddNewEmp: function (oEvent) {
                debugger;
                var oPayload = this.getModel("JSONModel").getProperty("/CreateEmployee");
                oPayload.EMP_IMG = this.sImgStr;
                oPayload.IMG_URL = this.sBase64Img;
                var oModel = this.getModel();
                oModel.create("/EMPLOYEE", oPayload, {
                    success: function (odata) {
                        debugger;
                        this.onCancelDialog();
                    }.bind(this),
                    error(error) {
                        debugger;
                    }
                })
            },


            handleDialogUploadPress: function () {
                var oFileUploader = sap.ui.getCore().byId("fileUploader");
                var oFile = oFileUploader.oFileUpload.files[0]; // Get the selected file

                if (oFile) {
                    var oFileReader = new FileReader();
                    oFileReader.onload = (e) => {
                        debugger;
                        this.sImgStr = e.target.result.split(",")[1];
                        this.sBase64Img = e.target.result;

                    };
                    oFileReader.readAsDataURL(oFile);
                }
            }



        });
    });
