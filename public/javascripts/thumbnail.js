// Add the thumbnail of a specific videoId to the end of thumbnails list.
function addToEndThumbnails(videoId){
	$("#thumbnail").append("<li>" + '<img src="http://img.youtube.com/vi/' + videoId + '/default.jpg">' + "</li>");
}

// Add the thumbnail of a specific videoId to the end of thumbnails list.
function addToTopThumbnails(videoId){
	$("#thumbnail").prepend("<li>" + '<img src="http://img.youtube.com/vi/' + videoId + '/default.jpg">' + "</li>");
}

function deleteFirstThumbnail(){
	jQuery("#thumbnail li:first-child").remove();
}