// Simple AJAX Example
$(function () {
    $('#like_topic_button').bind('click',
    function (event) {
      // Get the pair of username and topic
      var data = $('input').val();
      var pair = data.split('/');

      if (pair.length >= 3) {
        var username = pair[0];
        var topic = pair[1];
        var likes = pair[2];
        console.log(username);
        console.log(topic);
        console.log(likes);

        // Send to server:
        postUsernameLikeTopic(username, topic, function);
      }

      // Reset input field:
     // $('input').val('');

      return false;
    });
});
