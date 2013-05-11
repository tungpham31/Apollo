socket = io.connect();
//### When the client has successfully connected to the server
socket.on('connect', function () {
	// Load the IFrame Player API code asynchronously.
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
var player = undefined;
// A variable determine whether this user has started streaming video for the first time
var isStarted = false;
// The videoId of the current playing video
var currentVideoId = 'M7lc1UVf-VE';
function onYouTubePlayerAPIReady() {
  player = new YT.Player('ytplayer', {
    height: '390',
    width: '640',
    videoId: 'M7lc1UVf-VE',
    events: {
    	'onStateChange': onPlayerStateChange
    }
  });

  //call to polling 
  polling();

//register event for receiving state changes of youtube player from server.
socket.on('youtube_player_state_change', function(data){
	var theMessage = data.message;
	var theUserName = data.username;
	if (theMessage === "PAUSED") pausePlayer();
	if (theMessage === "PLAYING") playPlayer();
});

//called when a new video is added by the broadcaster.
socket.on('add_new_video_to_youtube_player', function(data){
	var url = data.url;
	var theUserName = data.username;	
	playVideoWithUrl(url);
});

//called when receive an update from server
socket.on('update_youtube_player_state', function(data){
	var videoId = data.videoId;
	var currentTime = data.currentTime;
	var playerState = data.playerState;
	if (!isStarted && player !== undefined){
		isStarted = true;
		currentVideoId = videoId;
		console.log("client get update from server " + videoId + " " + currentTime + " " + playerState + " " + player + " " + isStarted);
		if (playerState === YT.PlayerState.PLAYING)
			player.loadVideoById(videoId, currentTime, "medium");
		else{
			player.loadVideoById(videoId, currentTime, "medium");
			pausePlayer();
		}
	} 
});

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PAUSED){
		if ($("#ytplayer").attr("userName") != undefined){
			socket.emit('youtube_player_state_change', {"message" : "PAUSED", "username" : $("#ytplayer").attr("userName") });
		}
	}
	if (event.data == YT.PlayerState.PLAYING){
		if ($("#ytplayer").attr("userName") != undefined)
			socket.emit('youtube_player_state_change', {"message" : "PLAYING", "username" : $("#ytplayer").attr("userName") });
	}
}

// Listen to the event a new video is added in client side
$('#add_video_button').bind('click', function (e) {
	var url = $('#new_video').val();
	socket.emit('add_new_video_to_youtube_player', {"url" : url, "username" : $("#ytplayer").attr("userName")});
	return false;
});

// Polling, update video state so that everyone is one the same place
function polling(){
	setInterval(function(){
		// if this is the broadcaster then send the its current video state
		if ($("#ytplayer").attr("userName") != undefined && player != undefined){
			socket.emit('update_youtube_player_state', {"videoId" : currentVideoId, "current_time" : player.getCurrentTime(), 
				"player_state" : player.getPlayerState(), "username" : $("#ytplayer").attr("userName") });
		}
	}, 2000);
};

function pausePlayer(){
	if (player !== undefined){
		player.stopVideo();
	}
}

function playPlayer(){
	if (player !== undefined){
		isStarted = true;
		player.playVideo();
	}
}

// Send the function the youtube url, it will
// play the video accordingly
function playVideoWithUrl(url){
	if (url.indexOf("http://www.youtube.com/watch?v") ==! -1){
		// if the url seems to be in youtube url form
		// try to get the video id
		var top = url.indexOf("v=");
		top += 2;
		if (top + 11 <= url.length){
			// if the video id ca be extracted from the url
			var videoId = url.substring(top, top + 11);
			currentVideoId = videoId;
			player.loadVideoById(videoId, 0, "medium");
			return;
		}
	}

	// If the url is not valid, loadVideoByUrl so that youtube can handle it
	player.loadVideoByUrl(url, 0, "medium");
}
}

