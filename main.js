var FIX = {
    parse: function (message) {
        "use strict";

        var startOfHeader, tag, value, array, arrayLength, lastByte, i = 0,
            equalsOperator, output, item;

        output = document.getElementById("output");
        output.innerHTML = "";

        // Strip whitespaces
        message = message.replace(/ /g, '');

        // Weird SOH (NySE only?? should be 1 byte!)
        message = message.replace(/\^A/g, '|');

        startOfHeader = message.charAt(9);
        array = message.split(startOfHeader);

        lastByte = ((message.charAt(message.length - 1)) === startOfHeader) ? 1 : 0;
        arrayLength = array.length - lastByte;

        for (i; i < arrayLength; i++) {

            item = document.createElement("div");
            item.className = "item";
            output.appendChild(item);

            equalsOperator = array[i].indexOf("=");
            if (equalsOperator === -1) {
                item.className = "item error";
                item.innerHTML = "   ERR " + array[i] + "<br>";
                continue;
            }

            tag = array[i].substring(0, equalsOperator);
            value = array[i].substring(equalsOperator + 1);

            item.innerHTML = FIX.renderItem(tag, value, item);
        }
    },
    renderItem: function (tag, value, item) {
        "use strict";

        var returnString = "",
            specification = FIX.getSpecification(tag);

        // Set start-end colors
        if(parseInt(tag) === 8 || parseInt(tag) === 10) {
            item.className = "item green";
        }

        if(parseInt(tag) === 11 || parseInt(tag) === 37) {
            item.className = "item yellow";
        }

        if(parseInt(tag) === 108) {
            item.className = "item heartbeat";
        }

        // Raw command
        returnString += "<pre>" + tag + "=" + value + "</pre>";

        // Header
        returnString += "<h3><strong>" + specification.field + "(" + value + ") &lt;" + specification.datatype + "&gt;</strong></h3><br>";

        // Description
        returnString += "<strong>Description: </strong>" + specification.description + "<br>";

        // FIXML
        returnString += "<strong>Node: </strong> " + specification.xml + "<br>";

        return returnString;
    },
    getSpecification: function (tag) {
        "use strict";

        tag = parseInt(tag);
        var i = 0,
            returnValue = "{\"error\":true}";

        for (i; i < FIX50.length; i++) {
            if (tag === FIX50[i].tag) {
                returnValue = FIX50[i];
                break;
            }
        }

        return returnValue;
    },
    parseButtonHandler: function (event) {
        "use strict";

        event.preventDefault();

        var input = document.getElementById("message");
        FIX.parse(input.value);
    },
    init: function () {
        "use strict";
        var parseButton = document.getElementById("parseButton");
        parseButton.addEventListener("click", FIX.parseButtonHandler, false);
    }
};

window.addEventListener("load", FIX.init);