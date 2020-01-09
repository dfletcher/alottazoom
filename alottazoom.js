(function ( $ ) {

  /**
   * Default easing callback: start fast, end slow.
   */
  $.easing.alottaZoomZoom = function(x, t, b, c, d) {
    return 1-((1-x)*(1-x));
  };

  function pos(settings, x, y, z, animate, easing, duration) {

    // Constrain the X position to keep the image in bounds.
    var w = z * settings.source.width;
    if (w <= settings.width) {
      x = 0.5 * (settings.width - w);
    }
    else {
      var d = -1 * (w - settings.width);
      if (x < d) {
        x = d;
      }
      else if (x > 0) {
        x = 0;
      }
    }

    // Constrain the Y position to keep the image in bounds.
    var h = z * settings.source.height;
    if (h <= settings.height) {
      y = 0.5 * (settings.height - h);
    }
    else {
      var d = -1 * (h - settings.height);
      if (y < d) {
        y = d;
      }
      else if (y > 0) {
        y = 0;
      }
    }

    // Update state.
    settings.state.x = x;
    settings.state.y = y;
    settings.state.z = z;

    // Process markers.
    var centerx = (settings._hw - x) / z;
    var centery = (settings._hh - y) / z;
    var closest = [ settings.source.width*settings.source.width, null ];
    $('.marker', settings.$alottazoom).each(function() {
      var $marker = $(this);
      var markerw = $marker.width();
      var markerh = $marker.height();
      var markerx = (parseInt($marker.data('x'), 10) * z) - (0.5 * markerw);
      var markery = (parseInt($marker.data('y'), 10) * z) - (0.5 * markerh);
      var markerl = settings.state.x + markerx;
      var markert = (-1*h) + y + markery;
      var dx = centerx - markerx;
      var dy = centery - markery;
      var d = (dx * dx) + (dy * dy);
      var testy = markery + y;
      console.log(testy);
      if ((d < closest[0]) && (markerx > 0) && (markerx < settings.width) && (testy > 0) && (testy < settings.height)) {
        closest[0] = d;
        closest[1] = $marker;
      }
      var target = {
        left: markerl + 'px',
        top: markert + 'px'
      };
      if (animate) {
        $marker.stop().animate(target, duration, easing);
      }
      else {
        $marker.css(target);
      }
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
    var target = {
      width: w + 'px',
      left: x + 'px',
      top: y + 'px'
    };
    if (animate) {
      settings.$image.stop().animate(target, duration, easing);
    }
    else {
      settings.$image.css(target);
    }
  }

  function moveTo(settings, x, y) {
    var animate = (typeof(arguments[3]) != 'undefined') ? arguments[3] : true;
    pos(settings, x, y, settings.state.z, animate, settings.move_easing, settings.move_duration);
  }

  function moveBy(settings, x, y) {
    var animate = (typeof(arguments[3]) != 'undefined') ? arguments[3] : true;
    moveTo(settings, settings.state.x + x, settings.state.y + y, animate);
  }

  function center(settings, x, y) {
    var animate = (typeof(arguments[3]) != 'undefined') ? arguments[3] : true;
    var dx = -1.0 * (x * settings.state.z) + settings._hw;
    var dy = -1.0 * (y * settings.state.z) + settings._hh;
    moveTo(settings, dx, dy, animate);
  }

  function zoomTo(settings, z) {

    // Constrain the zoom to the user specified constraints.
    var sz = settings._zoomscalar * z;
    if (sz < settings.min_zoom) {
      z = settings.min_zoom / settings._zoomscalar;
    }
    else if (sz > settings.max_zoom) {
      z = settings.max_zoom / settings._zoomscalar;
    }
    var l = (((settings.state.x - settings._hw) / settings.state.z) * z) + settings._hw;
    var t = (((settings.state.y - settings._hh) / settings.state.z) * z) + settings._hh;

    // Zoom.
    var animate = (typeof(arguments[2]) != 'undefined') ? arguments[2] : true;
    pos(settings, l, t, z, animate, settings.zoom_easing, settings.zoom_duration)
  }

  function zoomBy(settings, z) {
    var animate = (typeof(arguments[2]) != 'undefined') ? arguments[2] : true;
    zoomTo(settings, settings.state.z + z, animate);
  }

  function reset(settings, animate) {
    var r = settings.width / settings.source.width;
    var h = settings.source.height * r;
    var x, y, z;
    if (((settings.zoom == 'fill') && (h > settings.height)) || ((settings.zoom == 'fit') && (h < settings.height))) {
      z = r;
      x = 0;
      y = (settings.height - h) / 2.0;
    }
    else if ((settings.zoom == 'fit') || (settings.zoom == 'fill')) {
      z = settings.height / settings.source.height;
      x = (settings.width - (z * settings.source.width)) / 2.0;
      y = 0;
    }
    else if (typeof(settings.zoom) == 'number') {
      x = settings.x;
      y = settings.y;
      z = settings.zoom;
    }
    else {
      x = 0;
      y = 0;
      z = 1.0;
    }
    settings._zoomscalar = 1.0 / z;
    pos(settings, x, y, z, animate, settings.reset_easing, settings.reset_duration);
  }

  /**
   *  Mouse up event workhorse function. Ends dragging action and possibly
   *  triggers a click.
   */
  function _mouseup(settings, e, inside) {
    if (settings._drag) {
      e.preventDefault();
      $(window).unbind("mousemove");
      //moveBy(settings, settings._mv.x - e.pageX, settings._mv.y - e.pageY, true);
      settings._drag = false;
    }
    else if (inside) {
      // @todo click
    }
  }

  function mouseup(e) {
    var settings = $(e.delegateTarget).data('alottazoom');
    if (settings) {
      _mouseup(settings, e, true);
    }
    else {
      $('.alottazoom-wrapper').each(function() {
        var settings = $(this).data('alottazoom');
        if (settings) {
          _mouseup(settings, e, false);
        }
      });
    }
  }

  var commands = {

    'reset': function(settings) {
      reset(settings, true);
    },

    'goto': function(settings) {
      zoomTo(settings, arguments[3]);
      center(settings, arguments[1], arguments[2]);
    },

    'shift': function(settings) {
      moveBy(settings, arguments[1], arguments[2]);
    },

  };
  
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
        width: this.width(), // @todo move this
        height: this.height(), // @todo move this
        $image: $('IMG', this), // @todo move this
        $alottazoom: this, // @todo move this
        zoom: 'fit',
        x: 0,
        y: 0,
        min_zoom: 1.0,
        max_zoom: 6.0,
        zoom_speed: 6.0,
        drag_speed: 0.68,
        move_easing: 'alottaZoomZoom',
        move_duration: 750,
        zoom_easing: 'alottaZoomZoom',
        zoom_duration: 550,
        reset_easing: 'alottaZoomZoom',
        reset_duration: 550,
        marker_activate_callback: null,
        marker_deactivate_callback: null
      }, options );

      $alottazoom.addClass('alottazoom-wrapper-loading').data('alottazoom', settings);
      settings.$image.addClass('alottazoom-image-loading').on('load', function() {

        $alottazoom.removeClass('alottazoom-wrapper-loading').addClass('alottazoom-wrapper');
        settings.$image.removeClass('alottazoom-image-loading').addClass('alottazoom-image');

        settings.source = { width: settings.$image.width(), height: settings.$image.height() };
        settings.mouse = { x: 0, y: 0 };
        settings.state = { x: 0, y: 0, z: 0 };
        settings._drag = false;
        settings._hw = 0.5 * settings.width;
        settings._hh = 0.5 * settings.height;
        settings._mv = { x: 0, y: 0 };

        reset(settings, false);

        $alottazoom.mouseup(mouseup).bind('DOMMouseScroll mousewheel', function(e) {
          e.preventDefault();
          zoomBy(settings, -1.0 * (e.originalEvent.detail ? e.originalEvent.detail : (e.originalEvent.wheelDelta / -40.0)) * settings.zoom_speed / 100.0);
        })
        .mousedown(function(e) {
          e.preventDefault();
          settings.mouse.x = e.pageX;
          settings.mouse.y = e.pageY;
          settings._mv.x = e.pageX;
          settings._mv.y = e.pageX;
          $(window).mousemove(function(e) {
            e.preventDefault();
            settings._drag = true;
            var dx = e.pageX - settings.mouse.x;
            var dy = e.pageY - settings.mouse.y;
            var l = settings.state.x + (dx * settings.drag_speed);
            var t = settings.state.y + (dy * settings.drag_speed);
            moveTo(settings, l, t, false);
            settings.mouse.x = e.pageX;
            settings.mouse.y = e.pageY;
          });
        });

        $(window).mouseup(mouseup).resize(function(e) {
          $('.alottazoom-wrapper').each(function() {
            var $alottazoom = $(this);
            var settings = $alottazoom.data('alottazoom');
            settings.width = $alottazoom.width();
            settings.height = $alottazoom.height();
            settings._hw = 0.5 * settings.width;
            settings._hh = 0.5 * settings.height;
          });
        });

      });

    }
    return this;
  }

}( jQuery ));
