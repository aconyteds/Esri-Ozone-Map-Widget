define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"],
    function(Channels, Validator, Error) {
    /**
     * @copyright © 2013 Environmental Systems Research Institute, Inc. (Esri)
     *
     * @license
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at<br>
     * <br>
     *     {@link http://www.apache.org/licenses/LICENSE-2.0}<br>
     * <br>
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * @description The Plot module provides methods for using a feature plotting OWF Eventing channel
     * according to the [CMWAPI 1.1 Specification](http://www.cmwapi.org).  This module
     * abstracts the OWF Eventing channel mechanism from client code and validates messages
     * using specification rules.  Any errors are published
     * on the map.error channel using an {@link module:cmwapi/map/Error|Error} module.
     *
     * According to the
     * CMWAPI Specification payloads sent over the channel may require validation of individual parameters or
     * default values for omitted parameters.  Where possible, this module abstracts those rules from client code.
     * Both the send and addHandler functions will auto-fill defaults for missing parameters. Further, addHandler
     * will wrap any passed-in function with payload validation code, so that they fail fast on invalid payloads and
     * do not push bad data into any map specific handlers.  A summary of payload errors is pushed to the
     * {@link module:cmwapi/map/Error|Error} channel if that occurs.
     *
     * @version 1.1
     *
     * @exports cmwapi/map/feature/Plot
     */
    var Plot = {

        /**
         * Send information that plots one or more map features.
         * @param {Object|Object[]} data
         * @param {String} [data.overlayId] The ID of the overlay.  If a valid ID string is not specified, the sending widget's ID is used.
         * @param {String} data.featureId The ID of the feature.  If an ID is not specified, an error is generated.
         * @param {String} [data.name] The name of the feature.  If a valid name string is not specified,
         *     the featureId is used.  Names are not unique and are meant purely for display purposes.
         * @param {String} [data.format] The format of the feature.  If not specified, this defaults to "kml".
         * @param {String} data.feature The data of the feature.
         * @param {Boolean} [data.zoom] True, if the map should automatically zoom to this feature; false, otherwise.
         *     Defaults to false.
         */
        send: function(data) {

            // validData will story results from any Validator and may be resused for internal
            // error bookkeeping.
            var validData = Validator.validObjectOrArray(data);
            var payload = validData.payload;

            // If the data was not in proper payload structure, an Object or Array of objects,
            // note the error and return.
            if (!validData.result) {
                Error.send( OWF.getInstanceId(), Channels.MAP_FEATURE_PLOT, data,
                    validData.msg);
                return;
            }

            // Check all the feature objects; fill-in any missing attributes.
            for (var i = 0; i < payload.length; i ++) {
                // The overlayId is optional; defaults to widget id if not specified.
                payload[i].overlayId = (payload[i].overlayId) ? payload[i].overlayId : OWF.getInstanceId();

                if (!payload[i].featureId) {
                    validData.result = false;
                    validData.msg += 'Need a feature Id for feature at index ' + i + '. ';
                }

                // The name is optional; defaults to the feature id if not specified
                // if (payload[i].featureId) {
                //     payload[i].name = (payload[i].name) ? payload[i].name : payload[i].featureId;
                // }

                // Check for a format.  If it exists, retain; otherwise, default to kml.
                payload[i].format = (payload[i].format) ? payload[i].format : "kml";

                if (!payload[i].feature) {
                    validData.result = false;
                    validData.msg += 'Need feature data for feature at index ' + i + '. ';
                }

                // Zoom is optional; if it doesn't exist, explicitly set it to the default.
                payload[i].zoom = (payload[i].zoom) ? payload[i].zoom : false;
            }

            // Send along the payload if we did not fail validation.
            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_PLOT, Ozone.util.toString(payload[0]));
                }
                else {
                    OWF.Eventing.publish(Channels.MAP_FEATURE_PLOT, Ozone.util.toString(payload));
                }
            }
            else {
                Error.send( OWF.getInstanceId(), Channels.MAP_FEATURE_PLOT,
                    Ozone.util.toString(data),
                    validData.msg);
            }

        },

        /**
         * Subscribes to the feature plot channel and registers a handler to be called when messages
         * are published to it.
         * @param {module:cmwapi/map/feature/Plot~Handler} handler An event handler for any creation messages.
         * @return {module:cmwapi/map/feature/Plot~Handler} The original event handler wrapped in CMWAPI payload validation code.
         *     Where appropriate default values for missing payload attributes are filled in and
         *     invalid payloads are noted on the Error channel prior to execution of the
         *     the input handler.  Invalid payloads will short-circuit execution of the provided handler.
         */
        addHandler: function(handler) {

            // Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function(sender, msg) {

                // Parse the sender and msg to JSON.
                var jsonSender = Ozone.util.parseJson(sender);
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];
                var validData = true;
                var errorMsg = "";

                for (var i = 0; i < data.length; i ++) {
                    // The overlayId is optional; defaults to widget id if not specified.
                    data[i].overlayId = (data[i].overlayId) ? data[i].overlayId : jsonSender.id;

                    if (!data[i].featureId) {
                        validData = false;
                        errorMsg += 'Need a feature Id for feature at index ' + i + '. ';
                    }

                    // The name is optional; defaults to the feature id if not specified
                    // if (data[i].featureId) {
                    //     data[i].name = (data[i].name) ? data[i].name : data[i].featureId;
                    // }

                    // Check for a format.  If it exists, retain; otherwise, default to kml.
                    data[i].format = (data[i].format) ? data[i].format : "kml";

                    if (!data[i].feature) {
                        validData = false;
                        errorMsg += 'Need feature data for feature at index ' + i + '. ';
                    }

                    // Zoom is optional; if it doesn't exist, explicitly set it to the default.
                    data[i].zoom = (data[i].zoom) ? data[i].zoom : false;
                }

                if (validData) {
                    handler(jsonSender.id, (data.length === 1) ? data[0] : data);
                }
                else {
                    Error.send(jsonSender.id, Channels.MAP_FEATURE_PLOT,
                        msg,
                        errorMsg);
                }

            };

            OWF.Eventing.subscribe(Channels.MAP_FEATURE_PLOT, newHandler);
            return newHandler;
        },

        /**
         * Stop listening to the channel and handling events upon it.
         */
        removeHandlers : function() {
            OWF.Eventing.unsubscribe(Channels.MAP_FEATURE_PLOT);
        }

        /**
         * A function for handling channel messages.
         * @callback module:cmwapi/map/feature/Plot~Handler
         * @param {String} sender The widget sending a format message
         * @param {Object|Object[]} data  A data object or array of data objects.
         * @param {String} data.overlayId The ID of the overlay.  If a valid ID string is not specified, the sending widget's ID is used.
         * @param {String} data.featureId The ID of the feature.  If an ID is not specified, an error is generated.
         * @param {String} [data.name] The name of the feature.  Names are not unique and are meant purely for display purposes.
         * @param {String} data.format The format of the feature.  This defaults to "kml".
         * @param {String} data.feature The data of the feature.
         * @param {Boolean} [data.zoom] True, if the map should automatically zoom to this feature; false, otherwise.
         *     Defaults to false.
         */

    };

    return Plot;

});
