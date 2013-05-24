var echo_nest_api_key = "7VI2RLSXC4GBPF6S7";
var create_radio_request = "http://developer.echonest.com/api/v4/playlist/dynamic/create?api_key=7VI2RLSXC4GBPF6S7&type=catalog-radio&seed_catalog=CACAJLI13ED4A7FB2C&adventurousness=.9";
var next_song_request = "http://developer.echonest.com/api/v4/playlist/dynamic/next?api_key=" + echo_nest_api_key + "&format=json&session_id="
var session_id = "236a7f3a9aaa46e48449708184b87b0f";
var favorite_song_request = "http://developer.echonest.com/api/v4/playlist/dynamic/feedback?api_key=7VI2RLSXC4GBPF6S7&format=json&session_id=" + session_id + "&favorite_song=last";
var ban_song_request = "http://developer.echonest.com/api/v4/playlist/dynamic/feedback?api_key=7VI2RLSXC4GBPF6S7&format=json&session_id=" + session_id + "&ban_song=last";
var lastRecommendedSong = undefined;
var lastRecommendedSongPositionInPlaylist = undefined;

createRadio();
// Create dynamic playlist and get session_id for playlist.
function createRadio(){
	$.getJSON(create_radio_request + "&_=" + Math.floor(Math.random()*1000000), function(data) {
		if (data.response.status.message === "Success"){
			//session_id = data.response.session_id;
			next_song_request = next_song_request + session_id;
		}
	});
}

// Call Echo Nest API for next recommended song.
function getRecommendedSong(){
	if (session_id !== undefined){
		$.getJSON(next_song_request + "&_=" + Math.floor(Math.random()*1000000), function(data) {
			if (data.response.status.message === "Success"){
				var lastRecommendedSong = data.response.songs[0];
				console.log(session_id);
				console.log(data);
				console.log(lastRecommendedSong.artist_name + " " +  lastRecommendedSong.title);
				addSongByTitleAndArtist(lastRecommendedSong.title, lastRecommendedSong.artist_name);
			}
		});
	}
}

// Send feedback back to Echonest indicating that user likes a song.
function likeSong(){
	$.getJSON(favorite_song_request + "&_=" + Math.floor(Math.random()*1000000), function(data) {
		if (data.response.status.message === "Success"){
			console.log("Like successufully");
			console.log(data);
		}
	});
}

// Send feedback back to Echonest indicating that user dislikes a song.
function dislikeSong(){
	$.getJSON(ban_song_request + "&_=" + Math.floor(Math.random()*1000000), function(data) {
		if (data.response.status.message === "Success"){
			console.log("Dislike successufully");
			console.log(data);
		}
	});
}