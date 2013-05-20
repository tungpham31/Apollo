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
	// If player state is either unstarted or ended
	if (player.getPlayerState() === -1 || player.getPlayerState() === 0){
		player.loadVideoById(nextSong(), 0, "default");
	}
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
    	nextSongId = nextSong();
    	if (nextSongId !== -1) player.loadVideoById(nextSongId, 0, "default");
    }
}
