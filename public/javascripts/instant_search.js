$(function() {
    $('#search_keyword').keyup(function (e) {
        var keyword = $('#search_keyword').val();
        if (keyword) {
          // Send keyword to server to search for user and topic containing that keyword.
          sendKeywordToServer(keyword, function(usersAndTopicsFound){
                // Post returned results from server to clien.
                var possibleResults = usersAndTopicsFound.data;
               // $("#search_keyword").autocomplete("enable");
                $("#search_keyword").autocomplete({
                  source: possibleResults
                });
          });
        }

        return false;
    });
  });

function sendKeywordToServer(keyword, callback) {
    // New request:
    var req = new XMLHttpRequest();

    // Get to server-side program:
    req.open('POST', '/search');

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
    var msg = { keyword : keyword,
                from : "instant search" };

    // Send request:
    req.send(JSON.stringify(msg));
}