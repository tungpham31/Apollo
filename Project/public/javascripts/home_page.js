$(document).ready(function () {
    var input = $('form#compose_twitt > input[type=twitt]');
    $('#compose_twitt_button').bind('click', function (e) {
        var v = $('#twitt_input').val();
        if (v) {
            // Send Twitt to server.
            sendTwittToServer(v, function(twittObject){
                // Post editted twitt received from server in client side.
                var edittedTwitt = twittObject.edittedTwitt;
                list_add(edittedTwitt);
            });
        }

        // Reset input field:
        $('#twitt_input').val('');
        return false;
    });
});


// Example 2: Add List Elements
function list_add(html) {
    var li = '<li>' + html + '</li>';
    $('ul#twitts').prepend(li);
}

function sendTwittToServer(twitt, callback) {
    // New request:
    var req = new XMLHttpRequest();

    // Get to server-side program:
    req.open('POST', '/twitt');

    // Set the state change handler:
    req.onreadystatechange = function () {
      //
      // There are five readyState values:
      //   UNSENT           0   open() has not been called yet.
      //   OPENED           1   open() has been called.
      //   HEADERS_RECEIVED 2   Headers have been received.
      //   LOADING          3   The response body is being received.
      //   DONE             4   The response is complete.
      //
   
      // Here we check for the DONE state and if we have a callback:
      if (req.readyState === 4 && callback) {
        callback(JSON.parse(req.responseText));
      }
    };

    // Set content type header field to JSON MIME type:
    req.setRequestHeader('Content-Type', 'application/json');
    
    // Construct a message to send to the server:
    var msg = { newTwitt : twitt };

    // Send request:
    req.send(JSON.stringify(msg));
}