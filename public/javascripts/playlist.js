// Playlist is queue keeping track of all songs has been played in the past and will be played in the future.
function Playlist(){
	this.playlist = new Array();
	this.first = 0;
	this.last = -1;
}

// Add a song id to the end of playlist.
Playlist.prototype.addSongById = function(videoId){
	this.last++;
	this.playlist.push(videoId);
	addToEndThumbnails(videoId);
	if (this.first === this.last) notifyPlayerAboutNewSong(); // If there is new song, notify player 
}

// Get the next song in the playlist (by id)
// If there is no next song return -1
Playlist.prototype.nextSong = function(){
	if (this.first > this.last){
		// If there is no song left in playlist, request a recommended song from engine.
		getRecommendedSong();
		return "-1";
	};
	deleteFirstThumbnail();
	var result = this.playlist[this.first];
	this.first++;
	return result;
}

Playlist.prototype.previousSong = function(){
	if (this.first <= 1) return "-1";
	
	this.first--;
	var result = this.playlist[this.first - 1];
	addToTopThumbnails(this.playlist[this.first]);
	return result;
}

// Return the id of the current song playing
Playlist.prototype.currentSong = function(){
	if (this.first === 0) return "-1";

	return this.playlist[this.first - 1];
}

// Search for a song with a particular title then add it to playlist.
Playlist.prototype.addSongByTitleAndArtist = function(title, artist){
	var request = gapi.client.youtube.search.list({
		q: title + " " + artist,
		part: 'snippet',
		maxResults: '1'
	});

	request.execute(function(response) {
	var str = JSON.stringify(response.result);
	var videoId = response.result.items[0].id.videoId;
	playlist.addSongById(videoId);
	});
}

// Determine whether there are more songs currently available in playlist
Playlist.prototype.hasNextSong = function(){
	if (this.first > this.last) return false;
	return true;
}


var playlist = new Playlist();