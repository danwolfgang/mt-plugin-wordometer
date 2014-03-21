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

    // Store the min/max word count preferences.
    $('#body-editor-count').data({ min: body_min_count, max: body_max_count });
    $('#extended-editor-count').data({ min: extended_min_count, max: extended_max_count });

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
        var field_label = jQuery('.selected-tab a').html();
        var field = '';
        var data  = '';

        // The rich text editor stores it's text in an iframe.
        if ( $('select#convert_breaks').val() == 'richtext' ) {
            // Is this the body field?
            if (field_label == 'Body') {
                field = $('iframe#editor-input-content_ifr');
            }
            // It must be the Extended field.
            else {
                field = $('iframe#editor-input-extended_ifr');
            }
            // data = field.contents().text();
            data = field.contents().find('body').html()
        }
        // Not the rich text editor.
        else {
            // Is this the body field?
            if (field_label == 'Body') {
                field = $('textarea#editor-input-content');
            }
            // It must be the Extended field.
            else {
                field = $('textarea#editor-input-extended');
            }
            data = field.val();
        }
        wordCount(field, data);
    },1000);
});

function wordCount(field, data) {
    // Because "this" is passed here, we need to find out what the id of
    // the element is that we're working with first, before anything else.
    var id = '#' + jQuery(field).attr('id');

    var separator = ' ';
    var name = 'words';

    if (id == '#tags') {
        separator = ',';
        name = 'tags';
    }

    // The Body and Extended fields get handled specially because their counter
    // placement is in a weird spot.
    if (id == '#editor-input-content' || id == '#editor-input-content_ifr') {
        var word_count_id = '#body-editor-count';
        var min_words = jQuery(word_count_id).data().min;
        var max_words = jQuery(word_count_id).data().max;
    }
    else if (id == '#editor-input-extended' || id == '#editor-input-extended_ifr') {
        var word_count_id = '#extended-editor-count';
        var min_words = jQuery(word_count_id).data().min;
        var max_words = jQuery(word_count_id).data().max;
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

    if(min_words > 0) {
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
    var numWords = '0';
    if (content != '' || content != undefined) {
        // Strip HTML
        content = content.replace(/<\/?[^>]+>/gi, ' ');
        // Change any line breaks to a space.
        content = content.replace(/[\r\n]+/gi, ' ');
        // And replace multiple spaces with a single space.
        content = content.replace(/\s+/gi, ' ');
        // Remove any leading or trailing white space.
        content = jQuery.trim(content);
        // Finally, count the number of words.
        if (content != '') {
            numWords = jQuery.grep(
                    content.split(separator),
                    function(n){ return(n) }
                ).length;
        }
    }

    // Print the count.
    jQuery(word_count_id).children('strong').text(numWords);

    // Add the "error" color if the minimum word count is not met or the max
    // word count is exceeded.
    if(numWords < min_words || (numWords > max_words && max_words != 0)) {
        jQuery(word_count_id).addClass('error');
    } else {
        jQuery(word_count_id).removeClass('error');
    }

    // If the Body or Extended fields are being updated, also update the
    // total word count.
    if (id == '#editor-input-content' || id == '#editor-input-content_ifr'
        || id == '#editor-input-extended' || id == '#editor-input-extended_ifr') {
        var num1 = parseFloat(jQuery('#body-editor-count').children('strong').html());
        var num2 = parseFloat(jQuery('#extended-editor-count').children('strong').html());
        var total_count =  num1 + num2;
        jQuery('#total-editor-count').children('strong').text(total_count);
    }
}
