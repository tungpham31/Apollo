// Playlist is queue keeping track of all songs will be played in the future.
var playlist = new Array();
var first = 0;
var last = -1;

// Add a song id to the end of playlist
function addSongById(videoId){
	last++;
	playlist.push(videoId);
	addToEndThumbnails(videoId);
	if (first === last) notifyPlayerAboutNewSong(); // If there is new song, notify player 
}

// Get the next song in the playlist (by id)
// If there is no next song return -1
function nextSong(){
	if (first > last) return "-1";
	deleteFirstThumbnail();
	var result = playlist[first];
	first++;
	return result;
}

function previousSong(){
	if (first <= 1) return "-1";
	
	first--;
	var result = playlist[first - 1];
	addToTopThumbnails(playlist[first]);
	return result;
}