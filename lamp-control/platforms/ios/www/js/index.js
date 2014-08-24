function alertDismissed() {
    // do something
}

var app = {

    macAddress: "E96E8CC6-F4AC-2651-F6BD-AA14574CEA97",
    chars: "",


    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.


    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        connectButton.addEventListener('touchend', app.manageConnection, false);
    },

    onDeviceReady: function() {
        // check to see if Bluetooth is turned on.
        // this function is called only
        //if isEnabled(), below, returns success:
        
        // don't need this anymore...
        /*
        var listPorts = function() {
            // list the available BT ports:
            bluetoothSerial.list(
                function(results) {
                    app.display(JSON.stringify(results));
                },
                function(error) {
                    app.display(JSON.stringify(error));
                }
            );
        }
        */

        // if isEnabled returns failure, this function is called:
        var notEnabled = function() {
            
        }

         // check if Bluetooth is on:
        bluetoothSerial.isEnabled(
            listPorts
        );
    },
/*
    Connects if not connected, and disconnects if connected:
*/
    manageConnection: function() {

        // connect() will get called only if isConnected() (below)
        // returns failure. In other words, if not connected, then connect:
        var connect = function () {
            // if not connected, do this:
            // attempt to connect:
            bluetoothSerial.connect(
                app.macAddress,  // device to connect to
                app.openPort   
            );
        };

        // disconnect() will get called only if isConnected() (below)
        // returns success  In other words, if  connected, then disconnect:
        var disconnect = function () {
            // if connected, do this:
            bluetoothSerial.disconnect(
                app.closePort     // stop listening to the port
            );
        };

        // here's the real action of the manageConnection function:
        bluetoothSerial.isConnected(disconnect, connect);
    },
/*
    subscribes to a Bluetooth serial listener for newline
    and changes the button:
*/
    openPort: function() {
        // if you get a good Bluetooth serial connection:

        connectButton.innerHTML = "Disconnect";
        // set up a listener to listen for newlines
        // and display any new data that's come in since
        // the last newline:
        

        $('#onBut').show();
        $('#status').removeClass('not-connected').html('connected');

        $('#onBut').on('click', function() {
            if($(this).hasClass('off')) {
                bluetoothSerial.write("0");
                $(this).removeClass('off').html('ON');
            } else {
                bluetoothSerial.write("1");
                $(this).addClass('off').html('OFF');
            }
        });

    
        bluetoothSerial.subscribe('\n');

    },

/*
    unsubscribes from any Bluetooth serial listener and changes the button:
*/
    closePort: function() {
        // if you get a good Bluetooth serial connection:
        // change the button's name:
        connectButton.innerHTML = "Connect";

        $('#status').addClass('not-connected').html('not connected');

        // unsubscribe from listening:
        bluetoothSerial.unsubscribe();
    },







/*
    appends @error to the message div:
*/
    showError: function(error) {
        app.display(error);
    },

/*
    appends @message to the message div:
*/
    display: function(message) {
        var display = document.getElementById("message"), // the message div
            lineBreak = document.createElement("br"),     // a line break
            label = document.createTextNode(message);     // create the label

        display.innerHTML(label);              // add the message node
    },
/*
    clears the message div:
*/
    clear: function() {
        var display = document.getElementById("message");
        display.innerHTML = "";
    }

//end of app
};
