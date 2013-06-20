// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('ytplayer', {
	  height: '390',
	  width: '640',
	  events: {
	    'onReady': onPlayerReady,
	    'onStateChange': onPlayerStateChange
	  }
	});
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
}

function notifyPlayerAboutNewSong(){
	console.log("In notifyPlayerAboutNewSong");

	if (!playlist.hasNextSong()) return;
	// If player state is either unstarted or ended
	if (player.getPlayerState() === -1 || player.getPlayerState() === 0)
		playNext();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
    	if ($('#repeat_button').attr("status") === "0") playNext()
    	else playCurrent();
    }
}

$(document).ready(function(){
	$('#next_button').click(function(event){
		player.seekTo(player.getDuration(), true);
	});

	$('#previous_button').click(function(event){
		playPrevious();
	});

	$('#repeat_button').click(function(event){
		if ($('#repeat_button').attr("status") === "0"){
			// If value is 0, means that it is not repeated, change to repeat mode.
			$('#repeat_button').attr("status", "1");
			$('#repeat_button').html('Stop Repeat');
		}
		else{
			// If value is 1, means that it is repeated, change to not-repeat mode.
			$('#repeat_button').attr("status", "0");
			$('#repeat_button').html('Repeat');
		}
	});

	$('#like_button').click(function(event){
		if ($('#like_button').attr("value") === "unliked"){
			$('#like_button').attr("value", "liked");
			$('#like_button').html("Unlike");
			likeSong();
		}
		else{
			$('#like_button').attr("value", "unliked");
			$('#like_button').html("Like");
		}
	});

	$('#dislike_button').click(function(event){
		dislikeSong();
		player.seekTo(player.getDuration(), true);
	});
})

function playNext(){
	nextSongId = playlist.nextSong();
    if (nextSongId !== "-1"){
		player.loadVideoById(nextSongId, 0, "default");
		// Reset like button
		$('#like_button').attr("value", "unliked");
		$('#like_button').html("Like");
	}
}

function playPrevious(){
	previousSongId = playlist.previousSong();
    if (previousSongId !== "-1"){
    	player.loadVideoById(previousSongId, 0, "default");
    	// Reset like button
		$('#like_button').attr("value", "unliked");
		$('#like_button').html("Like");
    }
}

function playCurrent(){
	currentSongId = playlist.currentSong();
	if (currentSongId !== "-1") player.loadVideoById(currentSongId, 0, "default");
}