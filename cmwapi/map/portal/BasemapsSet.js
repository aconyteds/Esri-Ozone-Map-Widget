define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], function(Channels, Validator, Error){
	return {
		send:function(data){
			var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;

            // If the data was not in proper payload structure, an Object or Array of objects,
            // note the error and return.
            if (!validData.result) {
                Error.send( OWF.getInstanceId(), Channels.MAP_PORTAL_BASEMAPS_SET, data,
                    validData.msg);
                return;
            }

            // Check all the overlay objects; fill-in any missing attributes. TODO
            for (var i = 0; i < payload.length; i ++) {
                // A basemap id must be defined
                if (!payload[i].id) {
                    validData.result = false;
                    validData.msg += 'Need an id for Basemap at payload ' + i + '. ';
                }
            }

            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_PORTAL_BASEMAPS_SET, Ozone.util.toString(payload[0]));
                }
                else {
                    OWF.Eventing.publish(Channels.MAP_PORTAL_BASEMAPS_SET, Ozone.util.toString(payload));
                }
            }
            else {
                Error.send( OWF.getInstanceId(), Channels.MAP_PORTAL_BASEMAPS_SET,
                    Ozone.util.toString(data),
                    validData.msg);
            }
		},
		addHandler:function(handler){
			// Wrap their handler with validation checks for API for folks invoking outside of our calls
            var newHandler = function(sender, msg) {

                // Parse the sender and msg to JSON.
                var jsonSender = Ozone.util.parseJson(sender);
                var jsonMsg = (Validator.isString(msg)) ? Ozone.util.parseJson(msg) : msg;
                var data = (Validator.isArray(jsonMsg)) ? jsonMsg : [jsonMsg];
                var validData = {result: true, msg: ""};

                for (var i = 0; i < data.length; i ++) {
                	// A basemap id must be defined
                	if (!data[i].id) {
                        validData.result = false;
                        validData.msg += 'Need an id for Basemaps at payload ' + i + '. ';
                    }
                }

                if (validData.result) {
                    handler(jsonSender.id, (data.length === 1) ? data[0] : data);
                }
                else {
                    Error.send(jsonSender.id, Channels.MAP_PORTAL_BASEMAPS_SET,
                        msg,
                        validData.msg);
                }
            };

            OWF.Eventing.subscribe(Channels.MAP_PORTAL_BASEMAPS_SET, newHandler);
            return newHandler;
		},
		removeHandler:function(){
			OWF.Eventing.unsubscribe(Channels.MAP_PORTAL_BASEMAPS_SET);
		}
	}
});