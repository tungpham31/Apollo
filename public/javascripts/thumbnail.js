function addThumbnail(videoId){
	$("#thumbnail").append("<li>" + '<img src="http://img.youtube.com/vi/' + videoId + '/default.jpg">' + "</li>");
}

function deleteFirstThumbnail(){
	jQuery("#thumbnail li:first-child").remove();
}