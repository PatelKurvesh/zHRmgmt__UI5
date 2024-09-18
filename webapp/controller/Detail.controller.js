sap.ui.define([
    "./App.controller",
    "sap/ui/model/json/JSONModel",
    "../model/models",
    'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
],
    function (BaseController, JSONModel, Models, exportLibrary, Spreadsheet) {
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
                debugger;
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
                            oJSONModel.setProperty("/Resume",[oData]);
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
            

            onUpload : function(oEvent){

            },

            createColumnConfig: function() {
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
    
    

            onDownload : function(oEvent){
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
                oSheet.build().finally(function() {
                    oSheet.destroy();
                });
            }
           
        });
    });