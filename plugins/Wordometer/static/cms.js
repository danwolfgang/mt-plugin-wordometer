$(document).ready(function() {
    // Add the field area for the Editor, because it's displayed specially.
    $('#editor-content-enclosure').after('<div id="editor-count"><span id="body-editor-count-container" onclick="app.saveHTML(false); wordCount(\'#editor-input-content\');">Body: <span id="body-editor-count" class="word-count"><strong>0</strong> words</span></span> <span id="extended-editor-count-container" onclick="app.saveHTML(false); wordCount(\'#editor-input-extended\');">Extended: <span id="extended-editor-count" class="word-count"><strong>0</strong> words</span></span> <span id="total-editor-count" class="word-count">Total: <strong>0</strong> words</span></div>');

    $('#editor-input-content').addClass('count['+body_count+']');
    $('#editor-input-extended').addClass('count['+extended_count+']');

    // Apply the word count on load.
    $.each($('#main-content textarea, #main-content .textarea-wrapper input, #editor-input-content, #editor-input-extended'), function() {
        wordCount(this);
    });
    // Apply the word count to any input or textarea field.
    $('#main-content textarea, #main-content .textarea-wrapper input, #editor-input-content, #editor-input-extended').bind('keyup click blur focus change paste', function() {
        wordCount(this);
    });
    // The editor needs special handling because it is built with the iframe, which complciates things.
    $('#editor-content-iframe').contents().find('html').bind('keyup click blur focus change paste', function() {
        //alert('editing in the iframe editor!');
        var data = $('#editor-content-iframe').contents().find('body').html();
        bodyAndExtendedFields(data);
    });
    $('#editor-content-textarea').bind('keyup click blur focus change paste', function() {
        //alert('editing in the textarea');
        var data = $('#editor-content-textarea').val();
        bodyAndExtendedFields(data);
    });
});

function bodyAndExtendedFields(data) {
    // Look at the editor tabs to decide if they're in the Body or Extended field.
    var field = $('.selected-tab a').text();
    if (field == 'Body') {
        wordCount('#editor-input-content', data);
    }
    // It must be the Extended field.
    else {
        wordCount('#editor-input-extended', data);
    }
}

function wordCount(field, data) {
    // Because "this" is passed here, we need to find out what the id of
    // the element is that we're working with first, before anything else.
    var id = '#' + $(field).attr('id');

    var elClass = $(id).attr('class');
    var minWords = 0;
    var maxWords = 0;
    var countControl = elClass.substring((elClass.indexOf('['))+1, elClass.lastIndexOf(']')).split(',');
    
    if(countControl.length > 1) {
        minWords = countControl[0];
        maxWords = countControl[1];
    } else {
        maxWords = countControl[0];
    }

    var separator = ' ';
    var name = 'words';

    if (id == '#tags') {
        separator = ',';
        name = 'tags';
    }

    // The Body and Extended fields get handled specially because their counter
    // placement is in a weird spot.
    if (id == '#editor-input-content') {
        var word_count_id = '#body-editor-count';
    }
    else if (id == '#editor-input-extended') {
        var word_count_id = '#extended-editor-count';
    }
    else {
        var label = id + '-label';
        var word_count_id = id + '-word-count';
        // Display a "(x words)" box, but only if the field has been used.
        if ( $(id).val() && $(word_count_id).length == 0 ) {
            // Remove the leading "#" so that we can correctly create the ID.
            word_count_id_text = word_count_id.replace(/#/,'');
            $(label).after('<span id="' + word_count_id_text + '" class="word-count">(<strong>0</strong> ' + name + ')</span>');
        }
    }

    if(minWords > 0) {
        $(word_count_id).addClass('error');
    }
    
    // content should already be set for the Body and Extended fields, but not
    // for the other fields, so do that now.
    var content = '';
    if (data) {
        content = data;
    }
    else {
        content = $(id).val();
    }
    
    content = content.replace(/<\/?[^>]+>/gi, ' ');
    // Change any line breaks to a space.
    content = content.replace(/[\r\n]+/gi, ' ');
    // And replace multiple spaces with a single space.
    content = content.replace(/\s+/gi, ' ');
    // Remove any leading or trailing white space.
    content = $.trim(content);
    // First, ensure that the field isn't empty.
    if (content == '') {
        var numWords = '0';
    }
    else {
        // Finally, count the number of words.
        var numWords = content.split(separator).length;
    }

    // Print the count.
    $(word_count_id).children('strong').text(numWords);

    if(numWords < minWords || (numWords > maxWords && maxWords != 0)) {
        $(word_count_id).addClass('error');
    } else {
        $(word_count_id).removeClass('error');
    }
    
    // If the Body or Extended fields are being updated, also update the 
    // total word count.
    if (id == '#editor-input-content' || id == '#editor-input-extended') {
        var num1 = parseFloat($('#body-editor-count').children('strong').text());
        var num2 = parseFloat($('#extended-editor-count').children('strong').text());
        var total_count =  num1 + num2;
        $('#total-editor-count').children('strong').text(total_count);
    }
}
