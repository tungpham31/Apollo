socket = io.connect();
//### When the client has successfully connected to the server
socket.on('connect', function () {
	var input = $('form#send_chat_message > input[type=chatMessage]');
	
	var username = $('#chat_message').attr("username");
	//join the "login" room. Emits a JSON object.
	socket.emit('join', {"room" : username}); 
	
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
    	socket.emit('addChatMessage', {"message" : $('#chat_message').val() , "username" : username });
		$('#send_chat_message_button').submit(function(e){e.preventDefault()});
		$('#chat_message').val('');
    	return false;
	 });
});