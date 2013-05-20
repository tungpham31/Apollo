// Playlist is queue keeping track of all songs will be played in the future.
var playlist = new Array();

// Add a song id to the end of playlist
function addSongById(videoId){
	playlist.push(videoId);
	addThumbnail(videoId);
	if (playlist.length === 1) notifyPlayerAboutNewSong(); // If there is new song, notify player 
}

// Get the next song in the playlist (by id)
// If there is no next song return -1
function nextSong(){
	if (playlist.length === 0) return "-1";
	deleteFirstThumbnail();
	var result = playlist[0];
	playlist.shift();
	return result;
}