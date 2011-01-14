package Wordometer::Plugin;

use strict;

sub update_template {
    my ($cb, $app, $template) = @_;

    # Add the Javascript
    my $old = q{<script type="text/javascript" src="<$mt:var name="static_uri"$>js/tc/client.js"></script>};
    $old = quotemeta($old);
    my $new = <<'END';
    <script type="text/javascript" src="<$mt:var name="static_uri"$>js/tc/client.js"></script>
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
    <script type="text/javascript" src="<mt:PluginStaticWebPath component="Wordometer">cms.js"></script>
    <link rel="stylesheet" href="<mt:PluginStaticWebPath component="Wordometer">cms.css" type="text/css" />
END

    # Add the counter min/max indicators
    my $plugin = MT->component('Wordometer');
    my $config = $plugin->get_config_hash('blog:' . $app->param('blog_id') );

    my $body_count;
    $body_count = $config->{'body_min_count'} || '0';
    $body_count = $body_count . ',' . $config->{'body_max_count'};

    my $extended_count;
    $extended_count = $config->{'extended_min_count'} || '0';
    $extended_count = $extended_count . ',' . $config->{'extended_max_count'};

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
