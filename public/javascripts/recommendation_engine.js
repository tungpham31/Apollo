var echo_nest_api_key = "7VI2RLSXC4GBPF6S7";
var create_radio_request = "http://developer.echonest.com/api/v4/playlist/dynamic/create?api_key=7VI2RLSXC4GBPF6S7&type=catalog-radio&seed_catalog=CAABOUD13216257FC7&adventurousness=.9";
var next_song_request = "http://developer.echonest.com/api/v4/playlist/dynamic/next?api_key=" + echo_nest_api_key + "&format=json&session_id="
var session_id = undefined;

createRadio();
// Create dynamic playlist and get session_id for playlist.
function createRadio(){
	$.getJSON(create_radio_request + "&_=" + Math.floor(Math.random()*1000000), function(data) {
		if (data.response.status.message === "Success"){
			session_id = data.response.session_id;
			next_song_request = next_song_request + session_id;
		}
	});
}

// Call Echo Nest API for next recommended song.
function getRecommendedSong(){
	if (session_id !== undefined){
		$.getJSON(next_song_request + "&_=" + Math.floor(Math.random()*1000000), function(data) {
			if (data.response.status.message === "Success"){
				var song = data.response.songs[0];
				console.log(song.artist_name + " " +  song.title);
				addSongByTitleAndArtist(song.title, song.artist_name);
			}
		});
	}
}