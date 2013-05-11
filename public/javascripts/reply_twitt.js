$(function () {
    $('[id=reply_twitt_button]').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
        $('#twitt_input').val('');
        $('#twitt_input').val('@' + $(this).attr('username'));
    });
});