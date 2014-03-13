jQuery(document).ready(function($) {
    // Add the word count field area for the Editor. It's created here (rather
    // than just appended to the field as the other word counters are) because
    // it's specially handled.
    $('#editor-content').after(
        '<div id="editor-count"><span id="body-editor-count-container" '
        + 'onclick="app.saveHTML(false); wordCount(\'#editor-input-content\');">'
        + 'Body: <span id="body-editor-count" class="word-count"><strong>0</strong> words</span></span> '
        + '<span id="extended-editor-count-container" onclick="app.saveHTML(false); wordCount(\'#editor-input-extended\');">Extended: <span id="extended-editor-count" class="word-count"><strong>0</strong> words</span></span> '
        + '<span id="total-editor-count" class="word-count">Total: <strong>0</strong> words</span></div>'
    );

    $('#editor-input-content').addClass('count['+body_count+']');
    $('#editor-input-extended').addClass('count['+extended_count+']');

    // Identify all of the fields to count.
    var fields = '#main-content textarea, #main-content input[type="text"], #editor-input-content, #editor-input-extended';

    // Apply the word count on load.
    $.each($(fields), function() {
        wordCount(this);
    });
    // Apply the word count to any input or textarea field.
    $(fields).on('keyup click blur focus change paste', function() {
        wordCount(this);
    });

    // The Body and Extended editors (in particular the rich text editor) needs
    // some special handling. Update the fields every second.
    setInterval(function(){
        var data = '';
        // The rich text editor stores it's text in an iframe.
        if ( $('select#convert_breaks').val() == 'richtext' ) {
            data = $('iframe#editor-input-content_ifr').contents().text();
        }
        else {
            data = $('#editor-content-textarea').text();
        }
        bodyAndExtendedFields(data);
    },1000);
});

function bodyAndExtendedFields(data) {
    // Look at the editor tabs to decide if they're in the Body or Extended
    // field.
    var field = jQuery('.selected-tab a').text();
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
    var id = '#' + jQuery(field).attr('id');
    var elClass = jQuery(id).attr('class');
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
    // Add the count HTML for all other fields.
    else {
        var label = id + '-label';
        var word_count_id = id + '-word-count';
        // Display a "(x words)" box, but only if the field has been used.
        if ( jQuery(id).val() && jQuery(word_count_id).length == 0 ) {
            // Remove the leading "#" so that we can correctly create the ID.
            word_count_id_text = word_count_id.replace(/#/,'');

            // The Title field gets it's count displayed a little differently
            if (id == '#title') {
                jQuery(id).after('<span id="' + word_count_id_text
                    + '" class="word-count">Title: <strong>0</strong> ' + name
                    + '</span>');
            }
            else {
                jQuery(label).after('<span id="' + word_count_id_text
                    + '" class="word-count">(<strong>0</strong> ' + name
                    + ')</span>');
            }
        }
    }

    if(minWords > 0) {
        jQuery(word_count_id).addClass('error');
    }

    // Content should already be set for the Body and Extended fields, but not
    // for the other fields, so do that now.
    var content = '';
    if (data) {
        content = data;
    }
    else {
        content = jQuery(id).val();
    }

    // First, ensure that the field isn't empty.
    if (content == '') {
        var numWords = '0';
    }
    else {
        // Strip HTML
        content = content.replace(/<\/?[^>]+>/gi, ' ');
        // Change any line breaks to a space.
        content = content.replace(/[\r\n]+/gi, ' ');
        // And replace multiple spaces with a single space.
        content = content.replace(/\s+/gi, ' ');
        // Remove any leading or trailing white space.
        content = jQuery.trim(content);
        // Finally, count the number of words.
        var numWords = content.split(separator).length;
    }

    // Print the count.
    jQuery(word_count_id).children('strong').text(numWords);

    if(numWords < minWords || (numWords > maxWords && maxWords != 0)) {
        jQuery(word_count_id).addClass('error');
    } else {
        jQuery(word_count_id).removeClass('error');
    }

    // If the Body or Extended fields are being updated, also update the
    // total word count.
    if (id == '#editor-input-content' || id == '#editor-input-extended') {
        var num1 = parseFloat(jQuery('#body-editor-count').children('strong').text());
        var num2 = parseFloat(jQuery('#extended-editor-count').children('strong').text());
        var total_count =  num1 + num2;
        jQuery('#total-editor-count').children('strong').text(total_count);
    }
}
