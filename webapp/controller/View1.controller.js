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
                this.readModuleDropDown();
                this.readEmployee();
                this.readEmployeeCount()
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
                oModel.read("/MODULE", {
                    success: function (odata) {
                        this.getModel("JSONModel").setProperty("/Module", odata.results)
                        MessageToast.show("oData Working Properly!")
                    }.bind(this),
                    error: function (error) {
                        // MessageToast.show("oData Service Not Working!!")
                    }
                })
            },

            readEmployeeCount: function () {
                var oModel = this.getModel();
                oModel.read("/EMPLOYEE/$count", {
                    success: function (odata) {
                        this.getModel("JSONModel").setProperty("/iEmpCount", odata);
                    }.bind(this),
                    error: function (error) {
                        // MessageToast.show("oData Service Not Working!!")
                    }
                })
            },

            readEmployee: function () {
                var oModel = this.getModel();
                // sap.ui.core.BusyIndicator.show();
                this.byId("projectTable").setBusy(true);
                oModel.read("/EMPLOYEE", {
                    "urlParameters": {
                        "$top": 5
                    },
                    success: function (oData) {
                        debugger;
                        var oJSONModel = this.getModel("JSONModel");
                        this.byId("projectTable").setBusy(false);
                        oJSONModel.setProperty("/Employee", oData.results);
                        oJSONModel.setProperty("/thresholdCount", oData.results.length);
                    }.bind(this),
                    error: function (error) {

                    }
                })
            },

            onLoadMoreEmployeePress: function () {
                var iSkipCount = this.getModel("JSONModel").getProperty("/thresholdCount");
                var oModel = this.getModel();
                this.byId("projectTable").setBusy(true);
                oModel.read("/EMPLOYEE", {
                    "urlParameters": {
                        "$top": 5,
                        "$skip": iSkipCount
                    },
                    success: function (oData) {
                        debugger;
                        var aResults = oData.results;
                        var oJSONModel = this.getModel("JSONModel");
                        this.byId("projectTable").setBusy(false);
                        var aEmployee = oJSONModel.getProperty("/Employee");
                        for (var r in aResults) {
                            aEmployee.push(aResults[r]);
                        }
                        oJSONModel.setProperty("/thresholdCount", aEmployee.length);
                        oJSONModel.refresh();
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
                    sap.ui.getCore().byId("saveBtn").setVisible(false);

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
                var sModuleKey = sap.ui.getCore().byId("INP_MODULE").getSelectedKey()
                oPayload.EMP_MODULE_MODULE_ID = parseInt(sModuleKey);
                oPayload.EMP_IMG = this.sImgStr;
                oPayload.IMG_URL = this.sBase64Img;
                var oModel = this.getModel();
                sap.ui.core.BusyIndicator.show();
                oModel.create("/EMPLOYEE", oPayload, {
                    success: function (odata) {
                        debugger;
                        var aEmployee = this.getModel("JSONModel").getProperty("/Employee");
                        aEmployee.push(odata);
                        sap.ui.core.BusyIndicator.hide();
                        this.onCancelDialog();
                        this.getModel("JSONModel").refresh(true);
                        this.readEmployeeCount();
                        MessageToast.show("Employee Added Successfully!!!")
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
                    sap.ui.getCore().byId("saveBtn").setVisible(true);
                }
                else {
                    MessageToast.show("Please Add Your Image");
                }
            },

            onUpdateFinished: function (oEvent) {
                debugger;
                // var aEmployee = this.getModel("JSONModel").getProperty("/Employee");
                // if(aEmployee && aEmployee !== undefined){
                //     oEvent.getSource().setVisible(true);
                // }
                var iTableCount = oEvent.getSource().getMaxItemsCount();
                this.setProperty("/iCount", iTableCount);
            },


            onSelectionChange: function (oEvent) {
                debugger;
                var aFilters = [];
                var oSelectedEmployee = oEvent.mParameters.listItem.getBindingContext("JSONModel").getObject();
                var oEmployeeFilter = this.getFilter("EMP_ID", sap.ui.model.FilterOperator.EQ, oSelectedEmployee.EMP_ID);
                aFilters.push(oEmployeeFilter);
                this.readDataWithParameter("/EMPLOYEE", "/SelectedEmployee", aFilters);
            }


        });
    });
