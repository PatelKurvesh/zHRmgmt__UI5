/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "zhrmgmtui5/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("zhrmgmtui5.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

                sap.ui.getCore().applyTheme("sap_fiori_3_dark");

                this.Chatbot();
            },

            Chatbot: function() {
                if (!document.getElementById("cai-webchat")) {
                    var s = document.createElement("script");
                       s.setAttribute("id", "cai-webchat");
                      s.setAttribute("src", "https://cdn.cai.tools.sap/webchat/webchat.js");
                          document.body.appendChild(s);
                    }
                    s.setAttribute("channelId", "5d4b041c-4fb4-4687-847c-c9de92867270");
                    s.setAttribute("token", "c6d94e61cf9ba4fcc23c391242869181");
            },
        });
    }
);