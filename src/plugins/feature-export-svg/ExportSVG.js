(function ($, pluginsNamespace, BaseTool) {
  'use strict';

  /**
   * Plugin to export canvas as SVG file
   *
   * @param {Easel.Easel} drawer
   * Instance of {@link Easel.Easel}.
   *
   * @constructor
   * @memberof Easel.plugins
   */
  var ExportSVG = function ExportSVGConstructor(drawer, options) {
    BaseTool.call(this, drawer);
    this._setupOptions(options);

    this.name = 'ExportSVG';
    this.btnClass = 'btn-export-svg';
    this.faClass = 'fa-download';
    this.tooltipText = drawer.t('Export as SVG');
  };

  ExportSVG.prototype = Object.create(BaseTool.prototype);
  ExportSVG.prototype.constructor = ExportSVG;

  ExportSVG.prototype._defaultOptions = {
    buttonOrder: 80,
    renderToolbarButton: false
  };

  /**
   * Setup options
   * @param {Object} options
   * @private
   */
  ExportSVG.prototype._setupOptions = function (options) {
    options = options || {};
    this.options = $.extend(true, {}, this._defaultOptions, options);
  };

  /**
   * On toolbar created - add control
   * @param {EaselToolbar} toolbar
   * @private
   */
  ExportSVG.prototype._onToolbarCreated = function (ev, toolbar) {
    if (this.options.renderToolbarButton === false) {
      return;
    }

    this.toolbar = toolbar;
    this.createControls(toolbar);
  };

  /**
   * Create controls
   * @param {EaselToolbar} toolbar
   */
  ExportSVG.prototype.createControls = function (toolbar) {
    this._createAndAddButton(toolbar);
  };

  /**
   * Remove tool
   */
  ExportSVG.prototype.removeTool = function(doDeleteToolbarCreationListeners) {
    if (this._toolbarCreatedEvent && doDeleteToolbarCreationListeners) {
      this.drawerInstance.off(this.drawerInstance.EVENT_TOOLBAR_CREATED, this._toolbarCreatedEvent);
      this._toolbarCreatedEvent = null;
    }
  };

  /**
   * Create button
   * @param {EaselToolbar} toolbar
   * @private
   */
  ExportSVG.prototype._createAndAddButton = function(toolbar) {
    var buttonConfig = {
      additionalClass: this.btnClass,
      iconClass: 'fa ' + this.faClass,
      tooltipText: this.tooltipText,
      buttonOrder: this.options.buttonOrder,
      clickHandler: this._onExportButtonClick.bind(this)
    };
    toolbar.addButton(buttonConfig);
  };

  /**
   * On export button click - export canvas to SVG
   */
  ExportSVG.prototype._onExportButtonClick = function() {
    this.exportCanvas();
  };

  ExportSVG.prototype.exportCanvas = function () {
    var canvas = this.drawer.fCanvas;
    if (!canvas) {
      return;
    }

    var cleanupState = this._prepareCanvasForExport(canvas);
    var svgString = '';

    try {
      svgString = canvas.toSVG();
    } finally {
      this._restoreCanvasAfterExport(canvas, cleanupState);
    }

    this._downloadSvg(svgString);
  };

  ExportSVG.prototype._prepareCanvasForExport = function (canvas) {
    var cleanupState = {
      backgroundColor: canvas.backgroundColor,
      backgroundImage: canvas.backgroundImage,
      sanitizedObjects: []
    };

    canvas.backgroundColor = null;
    canvas.backgroundImage = null;

    if (typeof canvas.getObjects === 'function') {
      var objects = canvas.getObjects();
      for (var i = 0; i < objects.length; i++) {
        var obj = objects[i];
        if (!obj || typeof obj.toSVG === 'function') {
          continue;
        }

        cleanupState.sanitizedObjects.push({
          object: obj,
          hadExcludeFlag: Object.prototype.hasOwnProperty.call(obj, 'excludeFromExport'),
          previousValue: obj.excludeFromExport
        });

        obj.excludeFromExport = true;
      }
    }

    return cleanupState;
  };

  ExportSVG.prototype._restoreCanvasAfterExport = function (canvas, cleanupState) {
    cleanupState = cleanupState || {};

    if (Object.prototype.hasOwnProperty.call(cleanupState, 'backgroundColor')) {
      canvas.backgroundColor = cleanupState.backgroundColor;
    }

    if (Object.prototype.hasOwnProperty.call(cleanupState, 'backgroundImage')) {
      canvas.backgroundImage = cleanupState.backgroundImage;
    }

    if (cleanupState.sanitizedObjects) {
      for (var i = 0; i < cleanupState.sanitizedObjects.length; i++) {
        var entry = cleanupState.sanitizedObjects[i];
        if (entry.hadExcludeFlag) {
          entry.object.excludeFromExport = entry.previousValue;
        } else {
          delete entry.object.excludeFromExport;
        }
      }
    }
  };

  ExportSVG.prototype._downloadSvg = function (svgString) {
    if (!svgString) {
      return;
    }

    var blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'canvas-export-' + Date.now() + '.svg';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  pluginsNamespace.ExportSVG = ExportSVG;

}(jQuery, Easel.plugins, Easel.plugins.BaseTool));
