socket = io.connect();
//### When the client has successfully connected to the server
socket.on('connect', function () {
		
	var input = $('form#send_chat_message > input[type=chatMessage]');
	
	var broadcasterName = $('#chat_message').attr("broadcastername");
	//join the "login" room. Emits a JSON object.
	socket.emit('join', {"room" : broadcasterName}); 
	
	//register event for receiving newly-signed up users.
	socket.on('newHangoutMessage', function(data){
		var theMessage = data.message;
		var theUserName = data.username;
		var msg = "<li>" + theUserName + ": " + theMessage + "</li>";
		$('ul#chat_list').prepend(msg);
	});
	
	//bind the click event to the "register" button on the login page.
	$('#send_chat_message_button').bind('click', function (e) {
		var username = $('#chat_message').attr("username");
		var broadcasterName = $('#chat_message').attr("broadcastername");
    	socket.emit('addHangoutMessage', {"message" : $('#chat_message').val() , "username" : username , "broadcasterName" : broadcasterName });
    	 $('#chat_message').val('');
		$('#send_chat_message_button').submit(function(e){e.preventDefault()});
    	return false;
	 });
});