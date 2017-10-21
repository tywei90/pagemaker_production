var $main = $('#main'),
    $edit = $('.edit', $main),
    preview = document.getElementById('previewIframe'),
    win = preview.contentWindow;
$main.delegate('.see', 'click', function(e) {
    win.document.open();
    win.document.write($edit.val());
    win.document.close();
});
$main.delegate('.gen', 'click', function(e) {
    var html = $edit.val();
    if (html) {
        $.post('/genpages/gen', { html: html, dir: 'test' }, function(data) {
        	console.log(data);
        })
    }
});
