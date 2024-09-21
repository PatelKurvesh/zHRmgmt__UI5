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
                // this.getView().byId("projectTable").setVisible(false);
                // this.readEmployee();
                this.readModuleDropDown();
                // this.readEmployeeCount()
                this.getView().byId("html").setContent("<canvas id='signature-pad' width='400' height='200' class='signature-pad'></canvas>");
                // this._initializeSignaturePad();
	
            },

            onModuleTypeChange: function (oEvent) {
                debugger;
                this.byId("filterbar2").setValue("");
                this.byId("filterbar2").setBusyIndicatorDelay(0);
                this.byId("filterbar2").setBusy(true);
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
                        this.byId("filterbar2").setBusy(false);
                    }.bind(this),
                    error: function (error) {
                        // MessageToast.show("oData Service Not Working!!")
                        sap.m.MessageBox.error("oData Not Working Properly!!!");
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
                        sap.m.MessageBox.error("oData Not Working Properly!!!");
                    }
                })
            },

            onSelectedModule : function(oEvent){
                this.byId("projectTable").setBusyIndicatorDelay(0);
                this.byId("projectTable").setBusy(true);
                var oSelectedItem = oEvent.mParameters.selectedItem;
                this.oSelectedModule = oSelectedItem.getBindingContext("JSONModel").getObject()
                this.getModel("JSONModel").setProperty("/SelecetdModule", [this.oSelectedModule]);
                var oModuleFilter = this.getFilter("EMP_MODULE_MODULE_ID",sap.ui.model.FilterOperator.EQ, this.oSelectedModule.MODULE_ID);
                this.readEmployeeCount()
                this.getModel().read("/EMPLOYEE", {
                    filters: [oModuleFilter],
                    "urlParameters": {
                        "$top": 5
                    },
                    success: function (oData) {
                        var oJSONModel = this.getModel("JSONModel");
                        this.byId("projectTable").setBusy(false);
                        oJSONModel.setProperty("/Employee", oData.results);
                        oJSONModel.setProperty("/thresholdCount", oData.results.length);
                        sap.m.MessageToast.show("Employee data loaded sucessfully");
                    }.bind(this),
                    error: function (oError) {
                        
                    }
                });

            },

            readEmployeeCount: function () {
                var oModel = this.getModel();
                var oModuleFilter = this.getFilter("EMP_MODULE_MODULE_ID",sap.ui.model.FilterOperator.EQ, this.oSelectedModule.MODULE_ID);
                oModel.read("/EMPLOYEE/$count", {
                    filters: [oModuleFilter],
                    success: function (odata) {
                        this.getModel("JSONModel").setProperty("/iEmpCount", odata);
                    }.bind(this),
                    error: function (error) {
                        sap.m.MessageBox.error("oData Not Working Properly!!!");
                    }
                })
            },

            readEmployee: function () {
                var oModel = this.getModel();
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
               var oTable = this.byId("projectTable");
               oTable.setBusyIndicatorDelay(0);
               oTable.setBusy(true);
                this.getModel().read("/EMPLOYEE", {
                    "urlParameters": {
                        "$top": 5,
                        "$skip": this.getModel("JSONModel").getProperty("/thresholdCount"),
                    },
                    success: function (oData) {
                        var oJSONModel = this.getModel("JSONModel");
                        this.byId("projectTable").setBusy(false);
                        var aEmployee = oJSONModel.getProperty("/Employee");
                        for (var r in oData.results) {
                            aEmployee.push(oData.results[r]);
                        }
                        aEmployee.sort((a, b) => {
                            return a.EMP_ID - b.EMP_ID
                        });
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
                var iTableCount = oEvent.getSource().getMaxItemsCount();
                this.setProperty("/iCount", iTableCount);
                var iVisibleEmpCount = this.getModel("JSONModel").getProperty("/iCount");
                if(iVisibleEmpCount < 5 ){
                    this.byId("footerbtn").setVisible(false);
                }else{
                    this.byId("footerbtn").setVisible(true);
                }
            },


            onSelectionChange: async function (oEvent) {
                debugger;
                sap.ui.core.BusyIndicator.show(0);
                var aFilters = [];
                var oSelectedEmployee = oEvent.mParameters.listItem.getBindingContext("JSONModel").getObject();
                var oEmployeeFilter = this.getFilter("EMP_ID", sap.ui.model.FilterOperator.EQ, oSelectedEmployee.EMP_ID);
                aFilters.push(oEmployeeFilter);
                var iEmployeeId = oSelectedEmployee.EMP_ID;
                await this.readDataWithParameter("/EMPLOYEE", "/SelectedEmployee", aFilters,"EMP_MODULE,EMP_CV,EMP_PRJ");
                this.getRouter().navTo("Detail", { Id: iEmployeeId });
                oEvent.mParameters.listItem.setSelected(false);
            },



            saveButton : function(oEvent){
                var canvas = document.getElementById("signature-pad");
                var link = document.createElement('a');
                link.href = canvas.toDataURL('image/jpeg'); 
                link.download = 'sign.jpeg';
                link.click(); 
                var signaturePad = new SignaturePad(document.getElementById('signature-pad'), {
                      backgroundColor: '#ffffff',
                      penColor: 'rgb(0, 0, 0)'
                })
            },

            



            _initializeSignaturePad: function () {
                var canvas = document.getElementById("signature-pad");
                var context = canvas.getContext("2d");
                canvas.width = 276;
                canvas.height = 180;
    
                // Set canvas styles
                context.fillStyle = "#fff";
                context.strokeStyle = "#444";
                context.lineWidth = 1.5;
                context.lineCap = "round";
                context.fillRect(0, 0, canvas.width, canvas.height);
    
                // Initialize variables
                var pixels = [];
                var xyLast = {};
                var xyAddLast = {};
                var calculate = false;
    
                // Functions for drawing
                var get_coords = function (e) {
                    var x, y;
                    if (e.changedTouches && e.changedTouches[0]) {
                        x = e.changedTouches[0].pageX - canvas.offsetLeft;
                        y = e.changedTouches[0].pageY - canvas.offsetTop;
                    } else {
                        x = e.offsetX || e.layerX;
                        y = e.offsetY || e.layerY;
                    }
                    return { x: x, y: y };
                };
    
                var on_mousedown = function (e) {
                    e.preventDefault();
                    var xy = get_coords(e);
                    context.beginPath();
                    context.moveTo(xy.x, xy.y);
                    pixels.push('moveStart', xy.x, xy.y);
                    xyLast = xy;
    
                    canvas.addEventListener('mousemove', on_mousemove, false);
                    canvas.addEventListener('mouseup', on_mouseup, false);
                    document.body.addEventListener('mouseup', on_mouseup, false);
                };
    
                var on_mousemove = function (e) {
                    var xy = get_coords(e);
                    var xyAdd = { x: (xyLast.x + xy.x) / 2, y: (xyLast.y + xy.y) / 2 };
    
                    if (calculate) {
                        var xLast = (xyAddLast.x + xyLast.x + xyAdd.x) / 3;
                        var yLast = (xyAddLast.y + xyLast.y + xyAdd.y) / 3;
                        pixels.push(xLast, yLast);
                    } else {
                        calculate = true;
                    }
    
                    context.quadraticCurveTo(xyLast.x, xyLast.y, xyAdd.x, xyAdd.y);
                    pixels.push(xyAdd.x, xyAdd.y);
                    context.stroke();
                    xyAddLast = xyAdd;
                    xyLast = xy;
                };
    
                var on_mouseup = function () {
                    canvas.removeEventListener('mousemove', on_mousemove, false);
                    document.body.removeEventListener('mouseup', on_mouseup, false);
                    context.stroke();
                    pixels.push('e');
                    calculate = false;
                };
    
                // Attach event listeners for touch and mouse interaction
                canvas.addEventListener('mousedown', on_mousedown, false);
                canvas.addEventListener('touchstart', on_mousedown, false);
            },
    
            onSign: function (oEvent) {
                this._initializeSignaturePad();
            },
    
            saveButton: function () {
                var canvas = document.getElementById("signature-pad");
                if (canvas) {
                    var link = document.createElement('a');
                    link.href = canvas.toDataURL('image/jpeg');
                    link.download = 'sign.jpeg';
                    link.click();
                    MessageToast.show("Signature saved as JPEG.");
                }
            },
    
            clearButton: function () {
                var canvas = document.getElementById("signature-pad");
                if (canvas) {
                    var context = canvas.getContext("2d");
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    MessageToast.show("Signature pad cleared.");
                }
            }
        

            


        });
    });
