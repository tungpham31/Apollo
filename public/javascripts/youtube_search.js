var apiKey = 'AIzaSyBa4zviAvx76SlSq7cWBV5nU09K3FVWnxs';

function handleClientLoad() {
	// Step 2: Reference the API key
	console.log("handle client load");
	gapi.client.setApiKey(apiKey);
	console.log("after provide key");
	gapi.client.load('youtube', 'v3', search);
}

// Search for a given string.
function search() {
	var q = "payphone";
	var request = gapi.client.youtube.search.list({
		q: q,
		part: 'snippet',
		maxResults: '1'
	});

	request.execute(function(response) {
	var str = JSON.stringify(response.result);
	var videoId = response.result.items[0].id.videoId;
	setTimeout(function(){player.loadVideoById(videoId, 0, "default");}, 2000);
	console.log("result = " + videoId);
	});
}