AlottaZoom
==========
(c) 2013 Dave Fletcher
All rights reserved

---

AlottaZoom: jQuery pan and zoom library
Version 0.0.1

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

API
---

### zoom (default: 'fill')
Default zoom level. Accepted values:
  - Numeric scale where 1.0 is full scale.
  - 'fit' Fit the image to the container.
  - 'fill' Fill the container with the image.

### x (default: 0)
When zoom is numeric, specify the horizontal viewport offset.

### y (default: 0)
When zoom is numeric, specify the vertical viewport offset.

### min_zoom (default: 'zoom')
Minimum zoom level. Accepted values:
  - Numeric scale where 1.0 is full scale.
  - 'fit' Fit container is the minimum zoom.
  - 'fill' Filled container is the minimum zoom.
  - 'zoom' Use the default zoom as minimum.

### max_zoom (default: 1.0)
Maximum zoom level. Normally should be left at 1.0, values larger than
this may cause the image to upscale.

### zoom_speed (default: 6.0)
Speed of zooming.

### drag_speed (default: 0.68)
Speed of dragging.

### move_easing (default: 'alottaZoomZoom')
Easing function for motion animation.

### move_duration (default 750)
Duration of motion animation in milliseconds.

### zoom_easing (default: 'alottaZoomZoom')
Easing function for zoom animation.

### zoom_duration (default: 550)
Duration of zoom animation in milliseconds.

### reset_easing (default: 'alottaZoomZoom')
Easing function for reset animation.

### reset_duration (default: 550)
Duration of reset animation in milliseconds.

### marker_activate_callback (default: null)
Callback function when a marker is activated.
Params: ($alottazoom, $marker)

### marker_deactivate_callback (default: null)
Callback function when a marker is deactivated.
Params: ($alottazoom, $marker)

When $.alottazoom() is called after construction it is used to control pan and
zoom locations or to reset to the initial state.

Commands
--------

### reset
    Reset the widget to the initial state.

### goto x, y, z
    Go to a particular x,y (in full-scale coordinates) and zoom level.

### shift x, y
    Shift the view vertically and/or horizontally.

### focus marker_id
    Center and zoom to the marker with the specified id.

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
      - Automatic max_zoom that does not allow upscaling.
      - Call $.alottazoom() with an object again after construction for
        updating multiple properties at once.
      - A command similar to "goto" that auto navigates to markers and pins
        without specifying numbers.
      - Link to markers and pins using URL fragments.

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
