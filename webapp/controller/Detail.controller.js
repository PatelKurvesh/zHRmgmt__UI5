sap.ui.define([
    "./App.controller",
    "sap/ui/model/json/JSONModel",
    "../model/models",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    'zhrmgmtui5/libs/jszip',
    'zhrmgmtui5/libs/xlsx',
    "sap/m/MessageToast",
],
    function (BaseController, JSONModel, Models, exportLibrary, Spreadsheet, jszip, XLSX, MessageToast) {
        "use strict";

        var EdmType = exportLibrary.EdmType;

        return BaseController.extend("zhrmgmtui5.controller.Detail", {

            onInit: function () {
                this.getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
                // this.onReadProject();
            },

            _onObjectMatched: function () {
                sap.ui.core.BusyIndicator.hide();

            },

            onUpdateFinished: function (oEvent) {
                var iTableCount = oEvent.getSource().getMaxItemsCount();
                this.setProperty("/iCount", iTableCount);
            },

            onBeforeUploadStarts: function (oEvent) {
                debugger;
                var that = this;
                var oFile = oEvent.mParameters.item.getFileObject();
                var oItem = oEvent.getParameter("item");
                var sFileName = oFile.name;
                var sMediaType = oItem.getMediaType();
                var iEmpId = parseInt(this.getRouter().getHashChanger().hash.split("/")[1]);

                var oFileObj = {
                    "FILE_NAME": sFileName,
                    "MEDIA_TYPE": sMediaType,
                    "EMP_ID": iEmpId
                };
                this.getModel("JSONModel").setProperty("/FileObj", oFileObj);

                var reader = new FileReader();
                reader.onload = (e) => {
                    var oDataModel = this.getModel();
                    var sCVStr = e.target.result.split(",")[1];
                    var oFile = this.getModel("JSONModel").getProperty("/FileObj");
                    var oFileObj = {
                        "FILE_NAME": oFile.FILE_NAME,
                        "MEDIA_TYPE": oFile.MEDIA_TYPE,
                        "EMP_EMP_ID": oFile.EMP_ID,
                        "CONTENT": sCVStr
                    };
                    this.byId("uploadSet").setBusyIndicatorDelay(0);
                    this.byId("uploadSet").setBusy(true);
                    oDataModel.create("/CV", oFileObj, {
                        success: function (oData) {
                            debugger;
                            var oJSONModel = this.getModel("JSONModel");
                            this.byId("uploadSet").removeAllItems();
                            oJSONModel.setProperty("/Resume", [oData]);
                            oJSONModel.refresh();
                            this.byId("uploadSet").setBusy(false);
                            sap.m.MessageBox.success("Resume added successfully!!");
                        }.bind(this),
                        error: function (oError) {
                            debugger;
                        }
                    });
                    oDataModel.setHeaders({
                        "x-cds-odata-version": ""
                    });
                };
                reader.readAsDataURL(oFile);
            },


            onUpload: function () {
                if (!this.Dialog) {
                    this.Dialog = sap.ui.xmlfragment("zhrmgmtui5.fragments.uploadexcel", this);
                    this.getView().addDependent(this.Dialog);
                    this.Dialog.open();
                }
                else {
                    this.Dialog.open();
                }
            },

            onCancelExcelData: function () {
                this.byId("fileUploader2").setValue("");
                this.Dialog.close();
                if (this.Dialog) {
                    this.Dialog.destroy();
                    this.Dialog = null;
                }
            },


            // handleDialogUploadPress: function (oEvent) {
            //     debugger;
            //     var oFileUploader = this.byId("fileUploader2");

            //     var oFile = oFileUploader.oFileUpload.files[0];
            //     if (oFile) {
            //         var reader = new FileReader();
            //         reader.onload = (e) => {
            //             var data = e.target.result;
            //             var workbook = XLS.read(data, { type: "binary" });

            //             var sheetName = workbook.SheetNames[0];
            //             var sheet = workbook.Sheets[sheetName];

            //             var aExcelData = XLS.utils.sheet_to_row_object_array(sheet);

            //             this._saveToOData(aExcelData);
            //             this.getModel("JSONModel").setProperty("/ExcelData", aExcelData);
            //             this.onUpload();
            //         };
            //         reader.readAsBinaryString(oFile);
            //     }
            //     else {
            //         MessageToast.show("Please Add Your Image");
            //     }


            // },


            handleDialogUploadPress: function (oEvent) {
                var oFileUploader = this.byId("fileUploader2");
                var oFile = oFileUploader.oFileUpload.files[0];
            
                if (oFile) {
                    var reader = new FileReader();
                    reader.onload = (e) => {
                        var arrayBuffer = e.target.result;
            
                        // Convert ArrayBuffer to binary string
                        var binaryString = this._arrayBufferToBinaryString(arrayBuffer);
            
                        // Process the binary data with XLSX
                        var workbook = XLS.read(binaryString, { type: "binary" });
            
                        var sheetName = workbook.SheetNames[0];
                        var sheet = workbook.Sheets[sheetName];
            
                        var aExcelData = XLS.utils.sheet_to_row_object_array(sheet);
            
                        this._saveToOData(aExcelData);
                        this.getModel("JSONModel").setProperty("/ExcelData", aExcelData);
                        this.onUpload();
                    };
                    reader.readAsArrayBuffer(oFile);
                } else {
                    MessageToast.show("Please Add Your Image");
                }
            },
            
            // Helper function to convert ArrayBuffer to binary string
            _arrayBufferToBinaryString: function(buffer) {
                var binary = '';
                var bytes = new Uint8Array(buffer);
                var len = bytes.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return binary;
            },
            

            _saveToOData: function (aExcelData) {
                var oModel = this.getView().getModel();

                // Assuming your OData entity name is 'Employee'
                aExcelData.forEach(function (oEntry) {
                    oModel.create("/PROJECT", oEntry, {
                        success: function (odata) {
                            MessageToast.show("Data saved successfully");
                        },
                        error: function (error) {
                            MessageToast.show("Error saving data");
                        }
                    });
                });
            },


            createColumnConfig: function () {
                var aCols = [];



                aCols.push({
                    label: 'PRJ_ID',
                    type: EdmType.Number,
                    property: 'PRJ_ID',
                    scale: 0
                });

                aCols.push({
                    property: 'PRJ_NAME',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'PRJ_BUDGET',
                    type: EdmType.String
                });

                aCols.push({
                    property: 'EMP_EMP_ID',
                    type: EdmType.Number
                });

                return aCols;
            },

            onDownload: function () {
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = this.byId('exportTable');
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Projects.xlsx',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },


            OnSaveExcelData: function () {
                var aExcelData = this.getModel("JSONModel").getProperty("/ExcelData");
                for (var e in aExcelData) {
                    var oExcelObj = aExcelData[e];
                    oExcelObj.PRJ_ID = parseInt(oExcelObj.PRJ_ID);
                    oExcelObj.EMP_EMP_ID = parseInt(oExcelObj.EMP_EMP_ID);
                    this.getModel().create("/PROJECT", oExcelObj, {
                        success: function (odata) {
                            debugger;
                            MessageToast.show("Data saved successfully");
                            this.onCancelExcelData();
                        }.bind(this),
                        error: function (error) {
                            MessageToast.show("Error saving data");
                        }
                    });
                }
            }

        });
    });