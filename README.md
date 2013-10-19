AlottaZoom
==========
(c) 2013 Dave Fletcher
All rights reserved

---

AlottaZoom: jQuery pan and zoom library
Version: 0.0.1

Usage
-----

See a [live example of AlottaZoom here](http://monkeysatkeyboards.com/alottazoom/example)
and examine the example code in the examples/ directory for more details.

    <div id="#alottazoom"><img src="reallybigimage.jpg"></div>
    <script src="jquery.min.js"></script>
    <script src="../alottazoom.js"></script>
    <script>
      (function ( $ ) {
        $(document).ready(function() {
          $('#wrapper').alottazoom();
        });
      }( jQuery ));
    </script>

The $.alottazoom() constructor accepts the following options:

    width (default: browser width)
    Set the width of the container widget. Not recommended, instead use CSS to
    position and size the container.

    height (default: browser height)
    Set the height of the container widget. Not recommended, instead use CSS to
    position and size the container.

    zoom (default: 1.0)
    Default zoom level.

    minzoom: (default: 1.0)
    Minimum zoom level.

    maxzoom: (default: 6.0)
    Maximum zoom level.

    zoomspeed (default: 6.0)
    Speed of zooming.

    dragspeed (default: 0.68)
    Speed of dragging.

    moveduration (default 750)
    Duration of motion animation in milliseconds.

    zoomduration (default: 550)
    Duration of zoom animation in milliseconds.

    resetduration (default: 550)
    Duration of reset animation in milliseconds.

    moveeasing (default: 'alottaZoomSquare')
    Easing function for motion animation.

    zoomeasing (default: 'swing')
    Easing function for zoom animation.

    reseteasing (default: 'swing')
    Easing function for reset animation.

    activate_content (default: 'slideDown')
    jQuery effect to use when marker related content is activated.

    activate_content_speed (default: 'slow')
    Duration of jQuery effect when marker related content is activated.

    deactivate_content (default: 'slideUp')
    jQuery effect to use when marker related content is deactivated.

    deactivate_content_speed (default: 'fast')
    Duration of jQuery effect when marker related content is deactivated.

    activate_content_callback (default: null)
    Callback function when a marker is activated.
    Params: ($alottazoom, $marker)

    deactivate_content_callback (default: null)
    Callback function when a marker is deactivated.
    Params: ($alottazoom, $marker)

When $.alottazoom() is called after construction it is used to control pan and
zoom locations or to reset to the initial state.

Commands
--------

    reset()
    Reset the widget to the initial state.

    goto(x,y,z)
    Go to a particular x,y (in full-scale coordinates) and zoom level.

    shift(x,y)
    Shift the view vertically and/or horizontally.

Version notes
-------------

    0.1.0 (current)
    First public release.

    1.x.x (roadmap)
    Short term goals and TODOs include:
      - Improved zooming.
      - Improved active marker detection.
      - Improved marker posititioning.
      - Improved panning: a small bit of momentum after drag and drop.
      - Smaller markers (pins) that appear when zoomed past a configurable
        threshold.
      - Use CSS hardware tranforms instead of $.animate() when available.
      - Automatic maxzoom that does not allow upscaling.
      - Call $.alottazoom() with an object again after construction for
        updating multiple properties at once.
      - A command similar to "goto" that auto navigates to markers and pins
        without specifying numbers.

Example image
-------------
The example image is a Creative Commons licensed image [available here](http://vectorguru.org/free-vectors/free-graphic-social-network-vector.html).

---

The MIT License (MIT)

Copyright (c) 2013 Dave Fletcher

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
