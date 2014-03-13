# Wordometer for Movable Type

When writing an entry, I like to have an idea of how long it is. I often use
the Body as an article lead-in and try to keep it between 50 and 75 words, but
when I start to throw some HTML into the mix it can be difficult to estimate.
Wordometer will count the words for me.

In addition to the Body, Wordometer will also count how many words are in the
Extended field, and provide a tally of these two fields. Additionally, Title,
Excerpt, Keywords, Tags, and even text custom fields will be counted. As you
type, the word count is incremented. Wordometer will ignore HTML tags and
anything in them. The count is unobtrusively displayed next to the field name.

A minimum and maximum word count highlight can also be added to the Body and
Extended fields. This is particularly helpful when you want to write a lead-in
in your Body of, say, roughly 100 words. The highlighter could be set to
between 75 and 125 words as sort of a "goal" area.


# Prerequisites

* Movable Type 5.x or 6.x
* Optional: Config Assistant 2.5+ (See installation notes below)


# Installation

To install this plugin follow the instructions found in the [Easy Plugin Installation Guide](https://github.com/openmelody/melody/wiki/install-EasyPluginInstallGuide)

If you have Config Assistant installed, you will be prompted to upgrade Movable
Type; this will automatically copy the static content into place. If you are
not using Config Assistant you'll need to copy the static content into place
yourself. (But then, if you're not using Config Assistant, you're probably used
to this practice.) Copy the contents of `[MT HOME]/plugins/Wordometer/static/`
to `[MT HOME]/mt-static/support/plugins/wordometer/`.

# Configuration

At the blog level, visit Tools > Plugins > Wordometer to set the highlight
indicators on the Body and Extended fields. The highlight indicators can be
used to set word count goals; just enter the minimum and maximum number of
words to trigger the highlight indicator.


# Use

It's really easy to use Wordometer because... well, there's no work involved
for you -- Wordometer handles it all!

Visit the Edit Entry page. If you create a new entry, Wordometer will count the
number of words or tags as you type them. If you edit an existing entry the
words and tags in each field will be counted when the page is loaded, and will
be incremented as you type.


# License #

This program is distributed under the terms of the GNU General Public License,
version 2.

# Copyright #

Copyright 2007-2014, [uiNNOVATIONS](http://uinnovations.com). All rights reserved.

This plugin can be found at http://eatdrinksleepmovabletype.com/plugins/wordometer/ and https://github.com/danwolfgang/mt-plugin-wordometer.
