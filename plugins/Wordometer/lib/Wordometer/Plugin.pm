package Wordometer::Plugin;

use strict;

sub update_template {
    my ($cb, $app, $template) = @_;

    # Add the Javascript
    my $old = q{<script type="text/javascript" src="<$mt:var name="static_uri"$>js/tc/client.js"></script>};
    $old = quotemeta($old);
    my $new = <<'END';
    <script type="text/javascript" src="<mt:Var name="static_uri">js/tc/client.js"></script>
    <script type="text/javascript" src="<mt:Var name="static_uri">support/plugins/wordometer/cms.js"></script>
    <style type="text/css">
        .field-header label { display: inline; }

        .word-count {
            margin-left: 10px;
            color: #a3a3a2;
        }

        .error { color: #990000; }

        #editor-count { margin-top: 5px; }

        #body-editor-count-container,
        #extended-editor-count-container {
            color: #a3a3a2;
            margin-right: 10px;
            cursor: pointer;
        }

        #title-word-count,
        #body-editor-count-container .word-count,
        #extended-editor-count-container .word-count,
        #total-editor-count.word-count { margin-left: 0; }

        #title-field { margin-bottom: 10px; }
    </style>
END

    # Add the counter min/max indicators
    my $plugin = MT->component('Wordometer');
    my $config = $plugin->get_config_hash('blog:' . $app->param('blog_id') );

    my $body_count;
    $body_count = $config->{'body_min_count'} || '0';
    $body_count = $body_count . ',' . ($config->{'body_max_count'} || '');

    my $extended_count;
    $extended_count = $config->{'extended_min_count'} || '0';
    $extended_count = $extended_count . ',' . ($config->{'extended_max_count'} || '');

    my $counter_vars .= <<END;
<script type="text/javascript">
    var body_count = '$body_count';
    var extended_count = '$extended_count';
</script>
END

    $new = $counter_vars . $new;

    $$template =~ s/$old/$new/;

}

1;

__END__
