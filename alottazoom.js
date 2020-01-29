(function ( $ ) {

  /**
   * Default easing callback: start fast, end slow.
   */
  $.easing.alottaZoomZoom = function(x, t, b, c, d) {
    return 1-((1-x)*(1-x));
  };

  function image_size($img) {
    var w = $img.width();
    var h = $img.height();
    $img.css('width', 'auto');
    $img.css('height', 'auto');
    var rval = {
      width: $img.width(),
      height: $img.height()
    };
    $img.css('width', w);
    $img.css('height', h);
    return rval;
  }
  
  function pos(settings, x, y, z, animate, easing, duration) {

    var hws = settings.source.hw * z;
    var hhs = settings.source.hh * z;

    // Constrain the X position to keep the image in bounds.
    var w = z * settings.source.width;
    var d = settings._hw - settings.source.hw;
    if (w <= settings.width) {
      x = d;
    }
    else {
      var minx = Math.floor(d - hws + settings._hw);
      var maxx = Math.floor(d + hws - settings._hw);
      if (x < minx) {
        x = minx;
      }
      else if (x > maxx) {
        x = maxx;
      }
    }

    // Constrain the Y position to keep the image in bounds.
    var h = z * settings.source.height;
    var d = settings._hh - settings.source.hh;
    if (h <= settings.height) {
      y = d;
    }
    else {
      var miny = Math.floor(d - hhs + settings._hh);
      var maxy = Math.floor(d + hhs - settings._hh);
      if (y < miny) {
        y = miny;
      }
      else if (y > maxy) {
        y = maxy;
      }
    }

    if ((settings.state.z != z) && (typeof(settings.zoom_callback) == 'function')) {
      settings.zoom_callback(settings.$alottazoom, settings.state.z, z);
    }

    // Update state.
    settings.state.x = x;
    settings.state.y = y;
    settings.state.z = z;

    // Process markers.
    var closest = [ Number.MAX_VALUE, null ];
    $('.marker', settings.$alottazoom).each(function() {
      var $marker = $(this);
      var markerl = ((parseInt($marker.data('x'), 10) - settings.source.hw)*z) + x + settings.source.hw + $marker.data('offsx');
      var markert = ((parseInt($marker.data('y'), 10) - settings.source.hh)*z) + y + settings.source.hh + $marker.data('offsy');
      var dx = markerl - settings._hw;
      var dy = markert - settings._hh;
      var d = (dx*dx) + (dy*dy);
      if (
        (d < closest[0]) &&
        (markert > 0) &&
        (markert < settings.height) &&
        (markerl > 0) &&
        (markerl < settings.width) &&
        (!$marker.hasClass('pin'))
      ) {
        closest[0] = d;
        closest[1] = $marker;
      }
      var t = 'translate(' + markerl + ',' + markert + ')';
      $marker.stop().animate({transform: t}, animate ? duration : 0, easing);
    });

    // Activate / deactivate markers.
    var $active = $('.marker.active', settings.$alottazoom);
    if (closest[1]) {
      if (!closest[1].hasClass('active')) {
        closest[1].addClass('active');
        if ($active.length) {
          $active.removeClass('active');
          if (typeof(settings.marker_deactivate_callback) == 'function') {
            settings.marker_deactivate_callback(settings.$alottazoom, $active);
          }
        }
        if (typeof(settings.marker_activate_callback) == 'function') {
          settings.marker_activate_callback(settings.$alottazoom, closest[1]);
        }
      }
    }
    else {
      if ($active.length) {
        $active.removeClass('active');
        if (typeof(settings.marker_deactivate_callback) == 'function') {
          settings.marker_deactivate_callback(settings.$alottazoom, $active);
        }
      }
    }

    // Apply transformation.
    var t = 'translate(' + x + 'px,' + y + 'px) scale(' + z + ')';
    settings.$image.stop(true)[animate?'animate':'css']({transform: t}, duration, easing);
  }

  function moveTo(settings, x, y) {
    var animate = (typeof(arguments[3]) != 'undefined') ? arguments[3] : true;
    pos(settings, x, y, settings.state.z, animate, settings.move_easing, settings.move_duration);
  }

  function moveBy(settings, x, y) {
    var animate = (typeof(arguments[3]) != 'undefined') ? arguments[3] : true;
    moveTo(settings, settings.state.x + (x * settings.state.z), settings.state.y + (y * settings.state.z), animate);
  }

  function center(settings, x, y) {
    var animate = (typeof(arguments[3]) != 'undefined') ? arguments[3] : true;
    moveTo(settings, settings._hw - (x * settings.state.z), settings._hh - (y * settings.state.z), animate);
  }

  function zoomTo(settings, z) {

    // Constrain the zoom to the user specified constraints.
    if (z < settings.min_zoom) {
      z = settings.min_zoom;
    }
    else if (z > settings.max_zoom) {
      z = settings.max_zoom;
    }

    var dw = settings._hw - (0.5 * settings.source.width);
    var dh = settings._hh - (0.5 * settings.source.height);

    var l = (settings.state.x-dw) / settings.state.z * z;
    var t = (settings.state.y-dh) / settings.state.z * z;

    l += dw;
    t += dh;

    // Zoom.
    var animate = (typeof(arguments[2]) != 'undefined') ? arguments[2] : true;
    pos(settings, l, t, z, animate, settings.zoom_easing, settings.zoom_duration);
  }

  function zoomBy(settings, z) {
    var animate = (typeof(arguments[2]) != 'undefined') ? arguments[2] : true;
    zoomTo(settings, settings.state.z + z, animate);
  }

  function reset(settings, animate) {
    settings.state.x = 0;
    settings.state.y = 0;
    var z = settings.startz;
    var x = -settings.startx;
    var y = -settings.starty;
    pos(settings, x + settings._hw, y + settings._hh, 0.0001, false, settings.reset_easing, settings.reset_duration);
    pos(settings, x + settings._hw, y + settings._hh, z, animate, settings.reset_easing, settings.reset_duration);
  }

  /**
   *  Mouse up event. Ends dragging action and possibly triggers a click.
   */
  function mouseup(e) {
    $('.alottazoom-wrapper').each(function() {
      $alottazoom = $(this);
      var settings = $alottazoom.data('alottazoom');
      if (settings) {
        $alottazoom.removeClass('dragging');
        if (settings && settings._drag) {
          settings._drag = false;
          settings._pinch = 0;
          e.preventDefault();
          $(window).unbind('mousemove touchmove');
          if (e.originalEvent.changedTouches && e.originalEvent.changedTouches[0]) {
            var touch = e.originalEvent.changedTouches[0];
            settings._gesture[settings._gesture.length] = { x: touch.pageX, y: touch.pageY, t: e.timeStamp };
          }
          else {
            settings._gesture[settings._gesture.length] = { x: e.pageX, y: e.pageY, t: e.timeStamp };
          }
          var last = settings._gesture.length - 1;
          var sample = last - 3;
          if (sample < 0) {
            sample = 0;
          }
          var t1 = settings._gesture[sample];
          var t2 = settings._gesture[last];
          var d = {
            t: t2.t - t1.t,
            x: t2.x - t1.x,
            y: t2.y - t1.y
          }
          d.x *= 3.5;
          d.y *= 3.5;
          moveBy(settings, d.x, d.y);
          settings._gesture = [];
        }
        //else if (inside) {
          // @todo click
        //}
      }
    });
  }

  function _mouseWheel(settings, e) {
    e.preventDefault();
    zoomBy(settings, -1.0 * (e.originalEvent.detail ? e.originalEvent.detail : (e.originalEvent.wheelDelta / -40.0)) * settings.zoom_speed / 100.0);
  }

  var commands = {

    'reset': function(settings) {
      reset(settings, true);
    },

    'goto': function(settings) {
      if (typeof(arguments[1]) == 'string') {
        var $marker = $(arguments[1]);
        zoomTo(settings, arguments[2]);
        center(settings, $marker.data('x'), $marker.data('y'));
      }
      else {
        zoomTo(settings, arguments[3]);
        center(settings, arguments[1], arguments[2]);
      }
    },

    'shift': function(settings) {
      moveBy(settings, arguments[1], arguments[2]);
    },

    'wheel': function(settings) {
      _mouseWheel(settings, arguments[1]);
    },

  };

  function _load($alottazoom, settings) {

    $alottazoom.removeClass('alottazoom-wrapper-loading').addClass('alottazoom-wrapper');
    settings.$image.removeClass('alottazoom-image-loading').addClass('alottazoom-image');
    settings.source = image_size(settings.$image);
    settings.$image.attr(settings.source).css(settings.source);
    settings.source.hw = settings.source.width * 0.5;
    settings.source.hh = settings.source.height * 0.5;
    settings.mouse = { x: 0, y: 0 };
    settings.state = { x: 0, y: 0, z: 1.0 };
    settings._drag = false;
    settings._hw = 0.5 * settings.width;
    settings._hh = 0.5 * settings.height;
    settings._gesture = [];
    // TODO this is "fill mode".
    /*var minzoom = settings.height / settings.source.height;
    if ((settings.source.height * minzoom) < settings.height) {
      minzoom = settings.width / settings.source.width;
    }
    settings.min_zoom = Math.max(settings.min_zoom, minzoom);*/

    // TODO this is "fit mode".
    var minzoom = settings.height / settings.source.height;
    if ((settings.source.width * minzoom) > settings.width) {
      minzoom = settings.width / settings.source.width;
    }
    settings.min_zoom = Math.max(settings.min_zoom, minzoom);

    // If no startx given, start at center.
    if (typeof(settings.startx) == 'undefined') {
      settings.startx = settings.source.hw;
    }

    // If no starty given, start at center.
    if (typeof(settings.starty) == 'undefined') {
      settings.starty = settings.source.hh;
    }

    // If no startz given, start at min_zoom.
    if (typeof(settings.startz) == 'undefined') {
      settings.startz = settings.min_zoom;
    }

    $('.marker', settings.$alottazoom).each(function() {
      var $marker = $(this);
      var w = $marker.width();
      var h = $marker.height();
      var pos = $marker.offset();
      var top = pos.top - settings.source.height;
      var left = pos.left;
      $marker.data('top', top);
      $marker.data('left', left);
      $marker.data('offsx', (-0.5*w));
      $marker.data('offsy', (-0.5*h));
    });

    reset(settings, true);

    $(window).bind('mouseup touchend', mouseup).resize(function(e) {
      $('.alottazoom-wrapper').each(function() {
        var $alottazoom = $(this);
        var settings = $alottazoom.data('alottazoom');
        settings.width = $alottazoom.outerWidth();
        settings.height = $alottazoom.outerHeight();
        settings._hw = 0.5 * settings.width;
        settings._hh = 0.5 * settings.height;
      });
    });

    $alottazoom.bind('mouseup touchend', mouseup).bind('DOMMouseScroll mousewheel', function(e) {
      _mouseWheel(settings, e);
    })
    .bind('touchstart', function(e) {
      e.preventDefault();
      // Drag start.
      var touch = e.originalEvent.changedTouches[0];
      settings.mouse.x = touch.pageX;
      settings.mouse.y = touch.pageY;
      settings._gesture[settings._gesture.length] = { x: touch.pageX, y: touch.pageY, t: e.timeStamp };
      settings._drag = true;
      $(window).bind('touchmove', function(e) {
        e.preventDefault();
        var touch = e.originalEvent.touches[0];
        $alottazoom.addClass('dragging');
        var dx = touch.pageX - settings.mouse.x;
        var dy = touch.pageY - settings.mouse.y;
        var l = settings.state.x + (dx * settings.swipe_speed);
        var t = settings.state.y + (dy * settings.swipe_speed);
        moveTo(settings, l, t, false);
        settings.mouse.x = touch.pageX;
        settings.mouse.y = touch.pageY;
        settings._gesture[settings._gesture.length] = { x: touch.pageX, y: touch.pageY, t: e.timeStamp };
        if (e.originalEvent.touches.length > 1) {
          // Pinch zoom.
          var t1 = e.originalEvent.touches[0];
          var t2 = e.originalEvent.touches[1];
          d = ((t1.pageX - t2.pageX) * (t1.pageX - t2.pageX)) + ((t1.pageY - t2.pageY) * (t1.pageY - t2.pageY));
          if (d > 16) {
            if (settings._pinch) {
              zoomBy(settings, (d - settings._pinch) * settings.pinchfactor * settings.pinchfactor);
            }
            settings._pinch = d;
          }
        }
      });
    })
    .bind('mousedown', function(e) {
      e.preventDefault();
      settings.mouse.x = e.pageX;
      settings.mouse.y = e.pageY;
      settings._gesture[settings._gesture.length] = { x: e.pageX, y: e.pageY, t: e.timeStamp };
      settings._drag = true;
      $(window).bind('mousemove', function(e) {
        e.preventDefault();
        $alottazoom.addClass('dragging');
        var dx = e.pageX - settings.mouse.x;
        var dy = e.pageY - settings.mouse.y;
        var l = settings.state.x + (dx * settings.drag_speed);
        var t = settings.state.y + (dy * settings.drag_speed);
        moveTo(settings, l, t, false);
        settings.mouse.x = e.pageX;
        settings.mouse.y = e.pageY;
        settings._gesture[settings._gesture.length] = { x: e.pageX, y: e.pageY, t: e.timeStamp };
      });
    });

    if (typeof(settings.load_callback) == 'function') {
      settings.load_callback(settings.$alottazoom);
    }

    $alottazoom.addClass('alottazoom-loaded');    
  }

  $.fn.alottazoom = function( options ) {

    var $alottazoom = this;

    var settings = $alottazoom.data('alottazoom');

    if (settings) {

      var otype = typeof(options);

      // Update mode.
      if (otype == 'object') {
        // @todo
      }

      // Command mode.
      else if (otype == 'string') {
        if (typeof(commands[options]) == 'function') {
          commands[options](settings, arguments[1], arguments[2], arguments[3]);
        }
      }

    }
    else {

      // Construction mode.
      settings = $.extend({
        width: this.outerWidth(), // @todo move this
        height: this.outerHeight(), // @todo move this
        $image: $('IMG', this), // @todo move this
        $alottazoom: this, // @todo move this
        zoom: 'fit',
        x: 0,
        y: 0,
        min_zoom: 0.01,
        max_zoom: 1.0,
        zoom_speed: 6.0,
        drag_speed: 0.68,
        swipe_speed: 1.2,
        pinchfactor: 0.0025,
        move_easing: 'alottaZoomZoom',
        move_duration: 750,
        zoom_easing: 'alottaZoomZoom',
        zoom_duration: 550,
        reset_easing: 'alottaZoomZoom',
        reset_duration: 1000,
        marker_activate_callback: null,
        marker_deactivate_callback: null,
        zoom_callback: null
      }, options);

      if (settings.$image[0].complete) {
        _load($alottazoom, settings);
      }
      else {
        settings.$image.on('load', function() {
          _load($alottazoom, settings);
        }).addClass('alottazoom-image-loading');
        $alottazoom.addClass('alottazoom-wrapper-loading').data('alottazoom', settings);
      }
      $alottazoom.data('alottazoom', settings);
    }
    return this;
  }

}( jQuery ));
