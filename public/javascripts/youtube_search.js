$(document).ready(function() {
 	document.getElementById("search_form").style.visibility="hidden";

 	$('#search_form').submit(function(event){
 		event.preventDefault();
		// Search for a given string.
		console.log("In Search");
		console.log($('#search_input').val());
		var q = $('#search_input').val();
		var request = gapi.client.youtube.search.list({
			q: q,
			part: 'snippet',
			maxResults: '1'
		});

		request.execute(function(response) {
		var str = JSON.stringify(response.result);
		var videoId = response.result.items[0].id.videoId;
		setTimeout(function(){player.loadVideoById(videoId, 0, "default");}, 2000);
		console.log("result = " + str);
		});
	});
});

var apiKey = 'AIzaSyBa4zviAvx76SlSq7cWBV5nU09K3FVWnxs';

function handleClientLoad() {
	// Reference the API key.
	gapi.client.setApiKey(apiKey);
	// Load youtube service
	gapi.client.load('youtube', 'v3', onYouTubeServiceLoaded);
}

function onYouTubeServiceLoaded(){
	// Set search form visible so that user can search for songs
	document.getElementById("search_form").style.visibility="visible";
}