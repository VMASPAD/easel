(function ($, Easel) {
  if (!$ || !Easel || !Easel.Easel) {
    return;
  }

  var DEFAULT_PLUGINS = [
    'Pencil',
    'Eraser',
    'Text',
    'Line',
    'ArrowOneSide',
    'ArrowTwoSide',
    'Diamond',
    'Rectangle',
    'Circle',
    'Image',
    'Polygon',
    'ImageCrop',
    'Color',
    'ShapeBorder',
    'ShapeFill',
    'BrushSize',
    'OpacityOption',
    'LineWidth',
    'StrokeWidth',
    'ShapeContextMenu',
    'OvercanvasPopup',
    'OpenPopupButton',
    'ToggleVisibilityButton',
    'MovableFloatingMode',
    'FullscreenModeButton',
    'ExportSVG'
  ];

  var DEFAULT_PLUGINS_CONFIG = {
    Image: {
      scaleDownLargeImage: true,
      maxImageSizeKb: 10240,
      cropIsActive: true
    },
    Text: {
      editIconMode: false,
      editIconSize: 'large',
      defaultValues: {
        fontSize: 32,
        lineHeight: 1.5,
        textFontWeight: 'normal'
      },
      predefined: {
        fontSize: [8, 12, 14, 16, 32, 40, 72],
        lineHeight: [1, 1.5, 2, 3, 4]
      }
    },
    Zoom: {
      enabled: true,
      showZoomTooltip: true,
      useWheelEvents: true,
      zoomStep: 1.05,
      defaultZoom: 1,
      maxZoom: 32,
      minZoom: 1,
      smoothnessOfWheel: 0,
      enableMove: true,
      enableWhenNoActiveTool: true,
      enableButton: true
    }
  };

  var DEFAULT_TOOLBARS = {
    drawingTools: {
      position: 'top',
      positionType: 'outside',
      compactType: 'scrollable',
      hidden: false,
      toggleVisibilityButton: false,
      fullscreenMode: {
        position: 'top',
        hidden: false,
        toggleVisibilityButton: false
      }
    },
    toolOptions: {
      position: 'bottom',
      positionType: 'inside',
      compactType: 'popup',
      hidden: false,
      toggleVisibilityButton: false,
      fullscreenMode: {
        position: 'bottom',
        compactType: 'popup',
        hidden: false,
        toggleVisibilityButton: false
      }
    },
    settings: {
      position: 'right',
      positionType: 'inside',
      compactType: 'scrollable',
      hidden: false,
      toggleVisibilityButton: false,
      fullscreenMode: {
        position: 'right',
        hidden: false,
        toggleVisibilityButton: false
      }
    }
  };

  var DEFAULT_DRAWER_OPTIONS = {
    plugins: DEFAULT_PLUGINS.slice(),
    corePlugins: ['Zoom', 'SelectionTool'],
    exitOnOutsideClick: false,
    debug: false,
    toolbars: DEFAULT_TOOLBARS,
    pluginsConfig: DEFAULT_PLUGINS_CONFIG,
    defaultActivePlugin: { name: 'Pencil', mode: 'lastUsed' },
    defaultImageUrl: '/examples/redactor/images/drawer.jpg',
    align: 'floating',
    transparentBackground: true,
    activeColor: '#E80F07',
    lineAngleTooltip: { enabled: false }
  };

  function resolveContainer(container) {
    if (!container) {
      return null;
    }

    if (container.jquery) {
      return container;
    }

    if (typeof container === 'string') {
      return $(container).first();
    }

    return $(container);
  }

  function SimpleEasel(options) {
    this.options = $.extend(true, {
      container: null,
      responsive: true,
      autoStart: true,
      autoStartDelay: 150,
      width: null,
      height: null,
      drawerOptions: {}
    }, options || {});

    this.$container = resolveContainer(this.options.container);
    this.drawer = null;
    this._resizeTimeout = null;
    this._resizeNamespace = '.drawerSimpleFactory-' + Math.round(Math.random() * 1000000);
  }

  SimpleEasel.prototype.init = function () {
    if (!this.$container || !this.$container.length) {
      throw new Error('Easel.create: container element not found');
    }

    this._renderEasel();
    return this;
  };

  SimpleEasel.prototype.destroy = function () {
    $(window).off('resize' + this._resizeNamespace);
    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);
      this._resizeTimeout = null;
    }

    if (this.drawer && typeof this.drawer.destroy === 'function') {
      this.drawer.destroy();
    }
    this.drawer = null;
  };

  SimpleEasel.prototype._renderEasel = function () {
    var size = this._measureSize();
    var drawerOptions = this._buildEaselOptions();

    if (this.drawer && typeof this.drawer.destroy === 'function') {
      this.drawer.destroy();
    }

    this.drawer = new Easel.Easel(null, drawerOptions, size.width, size.height);
    this.$container.empty().append(this.drawer.getHtml());
    this.drawer.onInsert();

    if (this.options.responsive) {
      this._bindResponsiveSizing();
    }

    if (this.options.autoStart) {
      this._autoStart(0);
    }
  };

  SimpleEasel.prototype._buildEaselOptions = function () {
    var overrides = this.options.drawerOptions || {};
    return $.extend(true, {}, DEFAULT_DRAWER_OPTIONS, overrides);
  };

  SimpleEasel.prototype._measureSize = function () {
    var width = parseInt(this.options.width, 10);
    var height = parseInt(this.options.height, 10);

    if (!width || width <= 0) {
      width = Math.round(this.$container.outerWidth());
      if (!width) {
        width = Math.round(this.$container.parent().outerWidth()) || window.innerWidth || 800;
      }
    }

    if (!height || height <= 0) {
      height = Math.round(this.$container.outerHeight());
      if (!height) {
        var parentHeight = Math.round(this.$container.parent().height());
        if (parentHeight > 0) {
          height = parentHeight;
        } else {
          var cssHeight = parseInt(this.$container.css('height'), 10);
          height = cssHeight > 0 ? cssHeight : 600;
        }
      }
    }

    return {
      width: width,
      height: height
    };
  };

  SimpleEasel.prototype._bindResponsiveSizing = function () {
    var self = this;
    $(window).off('resize' + this._resizeNamespace);
    $(window).on('resize' + this._resizeNamespace, function () {
      if (self._resizeTimeout) {
        clearTimeout(self._resizeTimeout);
      }

      self._resizeTimeout = setTimeout(function () {
        self._resizeTimeout = null;
        self._syncSizeWithContainer();
      }, 150);
    });
  };

  SimpleEasel.prototype._syncSizeWithContainer = function () {
    if (!this.drawer || typeof this.drawer.setSize !== 'function') {
      return;
    }

    var size = this._measureSize();
    this.drawer.setSize(size.width, size.height);
  };

  SimpleEasel.prototype._autoStart = function (attempt) {
    var self = this;
    if (!this.drawer || !this.drawer.api || typeof this.drawer.api.startEditing !== 'function') {
      if (attempt < 5) {
        setTimeout(function () {
          self._autoStart(attempt + 1);
        }, this.options.autoStartDelay);
      }
      return;
    }

    try {
      this.drawer.api.startEditing();
    } catch (err) {
      if (window.console && window.console.warn) {
        console.warn('Easel auto-start failed', err);
      }
      if (attempt < 5) {
        setTimeout(function () {
          self._autoStart(attempt + 1);
        }, this.options.autoStartDelay * 2);
      }
    }
  };

  Easel.SimpleEasel = SimpleEasel;

  Easel.create = function (options) {
    var simple = new SimpleEasel(options || {});
    simple.init();
    return simple.drawer;
  };

  Easel.createController = function (options) {
    var simple = new SimpleEasel(options || {});
    return simple.init();
  };

})(window.jQuery, window.Easel);
