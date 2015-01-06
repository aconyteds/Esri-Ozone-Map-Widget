define(["cmwapi/Channels", "cmwapi/Validator", "cmwapi/map/Error"], function(Channels, Validator, Error){
	return {
		send:function(data){
			var validData = Validator.validObjectOrArray( data );
            var payload = validData.payload;
            console.log([payload, validData]);

            // If the data was not in proper payload structure, an Object or Array of objects,
            // note the error and return.
            if (!validData.result) {
                Error.send( OWF.getInstanceId(), Channels.MAP_PORTAL_BASEMAPS, data,
                    validData.msg);
                return;
            }

            // Check all the overlay objects; fill-in any missing attributes. TODO
            for (var i = 0; i < payload.length; i ++) {
                // A basemap Gallery Group Query and Container must be defined
                if (!payload[i].url) {
                    validData.result = false;
                    validData.msg += 'Need a group and container for Portal Basemaps at payload ' + i + '. ';
                }
            }

            if (validData.result) {
                if (payload.length === 1) {
                    OWF.Eventing.publish(Channels.MAP_PORTAL_BASEMAPS, Ozone.util.toString(payload[0]));
                }
                else {
                    OWF.Eventing.publish(Channels.MAP_PORTAL_BASEMAPS, Ozone.util.toString(payload));
                }
            }
            else {
                Error.send( OWF.getInstanceId(), Channels.MAP_PORTAL_BASEMAPS,
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
                	// A basemap Gallery Group Query and Container must be defined
                	if (!data[i].url) {
                        validData.result = false;
                        validData.msg += 'Need a group and container for Portal Basemaps at payload ' + i + '. ';
                    }
                }

                if (validData.result) {
                    handler(jsonSender.id, (data.length === 1) ? data[0] : data);
                }
                else {
                    Error.send(jsonSender.id, Channels.MAP_PORTAL_BASEMAPS,
                        msg,
                        validData.msg);
                }
            };

            OWF.Eventing.subscribe(Channels.MAP_PORTAL_BASEMAPS, newHandler);
            return newHandler;
		},
		removeHandler:function(){
			OWF.Eventing.unsubscribe(Channels.MAP_PORTAL_BASEMAPS);
		}
	}
});