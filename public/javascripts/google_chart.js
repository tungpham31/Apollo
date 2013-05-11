google.load('visualization', '1', {'packages': ['geochart']});
google.setOnLoadCallback(drawRegionsMap);
function drawRegionsMap() {
  fetchFollowersDataFromServer(function(message){
    // get the followers 
    var followers = message.data;

    // get the countries of the followers 
    var countries = [];
    for (var followerid in followers){
      if (countries[followers[followerid].country] === undefined)
        countries[followers[followerid].country] = 1;
      else
        countries[followers[followerid].country]++;
    }

    var dataForChart = [['Country', 'Popularity']];
    // set data for data chart
    for (var country in countries)
      dataForChart.push([country, countries[country]]);
    dataForChart = google.visualization.arrayToDataTable(dataForChart);
    var options = {
      backgroundColor: {fill: 'transparent'},
      keepAspectRatio: true,
      height: 300,
      colorAxis: {minValue: 0,  colors: ['#8800bb', '#00FF00']},
      datalessRegionColor: '#8800bb'
    };
    var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
    chart.draw(dataForChart, options);
  });
};

function fetchFollowersDataFromServer(callback) {
  // New request:
  var req = new XMLHttpRequest();

  // Get to server-side program:
  req.open('POST', '/getFollowers');

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
  var msg = {};

  // Send request:
  req.send(JSON.stringify(msg));
} 