/**
 * Copyright © 2013 Environmental Systems Research Institute, Inc. (Esri)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at<br>
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(["cmwapi/Validator"], function(Validator) {

    describe("Channels tests.", function() {

        describe("Verify the validator ", function() {

            it("validates the CMWAPI 1.1 allowed request types.", function() {
                var types = ['about', 'format', 'view'];
                var results = Validator.validRequestTypes(types);
                expect(results.result).toBe(true);
            });

            it("fails incorrect CMWAPI 1.1 allowed request types.", function() {
                var results = Validator.validRequestTypes(['ghi']);

                expect(results.result).toBe(false);
            });

            it("validates the CMWAPI 1.1 allowed map types.", function() {
                var types = ['2-D', '3-D', 'other'];
                var results = Validator.validMapType(types[0]);
                expect(results.result).toBe(true);

                results = Validator.validMapType(types[1]);
                expect(results.result).toBe(true);

                results = Validator.validMapType(types[2]);
                expect(results.result).toBe(true);
            });

            it("fails incorrect CMWAPI 1.1 allowed map types.", function() {
                var results = Validator.validMapType(['ghi']);

                expect(results.result).toBe(false);
            });

            it("validates undefined objects for payloads and returns a payload array of a single empty object", function() {
                var results = Validator.validObjectOrArray();

                expect(results.result).toBe(true);
                expect(results.payload.length).toEqual(1);
            });

            it("validates an object as a valid payload and returns a payload array of one element", function() {
                var results = Validator.validObjectOrArray({overlayId: 'myOverlayId'});

                expect(results.result).toBe(true);
                expect(results.payload.length).toEqual(1);
                expect(results.payload[0].overlayId).toEqual("myOverlayId");
            });

            it("validates an object array as a valid payload and returns that as the payload", function() {
                var results = Validator.validObjectOrArray([{
                    overlayId: 'myOverlayId1'
                },{
                    overlayId: 'myOverlayId2'
                }]);

                expect(results.result).toBe(true);
                expect(results.payload.length).toEqual(2);
                expect(results.payload[0].overlayId).toEqual("myOverlayId1");
                expect(results.payload[1].overlayId).toEqual("myOverlayId2");
            });

            it("does not validate non objects or object arrays as payloads", function() {
                var results = Validator.validObjectOrArray(1);

                expect(results.result).toBe(false);
                expect(results.msg).not.toBeUndefined();
            });

            it("evaluates stringified JSON objects as strings.", function() {
                var jsonString = "{\"a\":\"b\"}";

                expect(Validator.isString(jsonString)).toBe(true);
            });

            it("validates correct, basic drag and drop payloads.", function() {
                var payload = {
                    overlayId: "overlay1",
                    featureId: "feature1",
                    name: "sample",
                    zoom: true,
                    marker: {
                        details: "foo",
                        iconUrl: "/sampleurl"
                    }
                };

                var validation = Validator.validDragAndDropPayload(payload);
                expect(validation.result).toBe(true);
            });


            it("validates drag and drop payloads that are missing overlayId, name, and zoom as they are optional.", function() {
                var payload = {
                    featureId: "feature1",
                    marker: {
                        details: "foo",
                        iconUrl: "/sampleurl"
                    }
                };

                var validation = Validator.validDragAndDropPayload(payload);
                expect(validation.result).toBe(true);
            });

            it("validates drag and drop payloads with empty markers.", function() {
                var payload = {
                    featureId: "feature1",
                    marker: {
                    }
                };

                var validation = Validator.validDragAndDropPayload(payload);
                expect(validation.result).toBe(true);
            });

            it("does not validate drag and drop payloads missing a marker, feature, and featureUrl.", function() {
                var payload = {
                    overlayId: "overlay1",
                    featureId: "feature1",
                    name: "sample",
                    zoom: true
                };

                var validation = Validator.validDragAndDropPayload(payload);
                expect(validation.result).toBe(false);
            });

            it("does not validate drag and drop payloads missing a featureId.", function() {
                var payload = {
                    overlayId: "overlay1",
                    name: "sample",
                    zoom: true,
                    marker: {
                        details: "foo",
                        iconUrl: "/sampleurl"
                    }
                };

                var validation = Validator.validDragAndDropPayload(payload);
                expect(validation.result).toBe(false);
            });

            it("does not validate drag and drop payloads with incomplete featureUrls.", function() {
                var payload = {
                    overlayId: "overlay1",
                    featureId: "feature1",
                    name: "sample",
                    zoom: true,
                    featureUrl: {
                        format: "kml"
                    }
                };

                var validation = Validator.validDragAndDropPayload(payload);
                expect(validation.result).toBe(false);

                // Revalidate with a missing format but valid url
                payload.featureUrl.url = "/sampleurl";
                delete payload.featureUrl.format;

                validation = Validator.validDragAndDropPayload(payload);
                expect(validation.result).toBe(false);

                // Add the format back and it should pass.
                payload.featureUrl.format = "kml";

                validation = Validator.validDragAndDropPayload(payload);
                expect(validation.result).toBe(true);

            });

            it("does not validate drag and drop payloads with incomplete features.", function() {
                var payload = {
                    overlayId: "overlay1",
                    featureId: "feature1",
                    name: "sample",
                    zoom: true,
                    feature: {
                        format: "kml"
                    }
                };

                var validation = Validator.validDragAndDropPayload(payload);
                expect(validation.result).toBe(false);

                // Revalidate with a missing format but valid url
                payload.feature.featureData = "some string data";
                delete payload.feature.format;

                validation = Validator.validDragAndDropPayload(payload);
                expect(validation.result).toBe(false);

                // Add the feature format back and it should pass.
                payload.feature.format = "kml";

                validation = Validator.validDragAndDropPayload(payload);
                expect(validation.result).toBe(true);
            });
        });
    });
});
