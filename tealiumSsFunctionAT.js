import { event, store } from "tealium";
(async () => {
    var eventData = event.data.udo;
    var eventSchemaArray = []; //placeholder for all schemas for tested actions e.g. user/page/job/account
    var errorMessage = "";

    //Importing testSchema to build eventSchemaArray based on tealium_event
    if (typeof store.get(eventData.tealium_event) !== "undefined") {
        var testSchema = JSON.parse(store.get(eventData.tealium_event));
        if (testSchema.hasOwnProperty("schemasList")) {
            for (var i = 0; i < testSchema.schemasList.length; i++) {
                if (testSchema.schemasList[i] != "undefined") {
                    eventSchemaArray.push(JSON.parse(store.get(testSchema.schemasList[i])));
                }
            }
        }
        if (testSchema.hasOwnProperty("eventSchema")) {
            eventSchemaArray.push(testSchema.eventSchema);
        }
    }

    var checkLength = function (key, schemaIndex) {
        var checkLengthResponse = "";
        if (typeof eventData[key] !== "undefined") {
            if (eventData[key].length <= parseInt(eventSchemaArray[schemaIndex][key].length)) {
                checkLengthResponse = key + " --> Correct length \n";
            } else {
                errorMessage += key + " --> Wrong length: " + eventData[key].length + "\n";
            }
        } else {
            errorMessage += "Can't check length of undefined: " + key + " is missing \n";
        }
        return checkLengthResponse;
    };

    var checkType = function (key, schemaIndex) {
        var checkTypeResponse = "";
        if (typeof eventData[key] !== "undefined") {
            if (eventSchemaArray[schemaIndex][key].type === "array" && typeof eventData[key] === "object" && eventData[key].length !== -1) {
                checkTypeResponse += key + " --> Correct type \n";
            } else if (eventSchemaArray[schemaIndex][key].type === typeof eventData[key]) {
                checkTypeResponse += key + " --> Correct type \n";
            } else {
                errorMessage += key + ' --> Wrong type: expected --> "' + eventSchemaArray[schemaIndex][key].type + '" but found ---> "' + typeof eventData[key] + '"\n';
            }
        }
        return checkTypeResponse;
    };

    var checkValue = function (key, schemaIndex) {
        var checkValueResponse = "";
        var method = 'exact'
        if (key.indexOf('*') === 0){
            method = 'contains';
            key = key.split('*')[1]
        }
        if (method === 'contains' && typeof eventData[key] !== "undefined" && eventData[key].toString().indexOf(eventSchemaArray[schemaIndex]["*"+key].value.toString()) !== -1) {
            checkValueResponse = key + " --> Correct value \n";
        }else if (method === 'exact' && typeof eventData[key] !== "undefined" && eventData[key].toString() === eventSchemaArray[schemaIndex][key].value.toString()) {
            checkValueResponse = key + " --> Correct value \n";
        } else {
            if(method === 'contains'){
                errorMessage += key + ' --> Wrong value: expected --> "' + eventSchemaArray[schemaIndex]["*"+key].value + '" but found ---> "' + eventData[key] + '"\n';
            }else if(method === 'exact'){
                errorMessage += key + ' --> Wrong value: expected --> "' + eventSchemaArray[schemaIndex][key].value + '" but found ---> "' + eventData[key] + '"\n';
            }else{
                errorMessage += 'TEST ERROR: ' + key;
            }
        }
        return checkValueResponse;
    };

    for (var i = 0; i < eventSchemaArray.length; i++) {
        for (var key in eventSchemaArray[i]) {
            if (typeof eventSchemaArray[i][key] !== "undefined" && eventSchemaArray[i][key].hasOwnProperty("value") === true) {
                checkValue(key, i);
            }
            if (typeof eventSchemaArray[i][key] !== "undefined" && eventSchemaArray[i][key].hasOwnProperty("type") === true) {
                checkType(key, i);
            }
            if (typeof eventSchemaArray[i][key] !== "undefined" && eventSchemaArray[i][key].hasOwnProperty("length") === true) {
                checkLength(key, i);
            }
        }
    }
    if (typeof errorMessage !== "undefined" && errorMessage !== "") {
        console.error(errorMessage);
    }
})();
