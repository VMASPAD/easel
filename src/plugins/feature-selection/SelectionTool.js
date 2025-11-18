(function (BaseTool, pluginsNamespace) {
  'use strict';

  /**
   * Selection tool that restores default canvas interaction so users can pick and move objects.
   *
   * @param {Easel.Easel} drawerInstance
   * @param {Object} options
   * @constructor
   * @memberof Easel.plugins
   * @augments Easel.plugins.BaseTool
   */
  var SelectionTool = function SelectionToolConstructor(drawerInstance, options) {
    BaseTool.call(this, drawerInstance, options);

    this.name = 'SelectionTool';
    this.btnClass = 'btn-selection';
    this.faClass = 'fa-mouse-pointer';
    this.tooltip = drawerInstance.t('Selection mode');
    this.toolOptionsList = [];

    this._defaultOptions = {
      buttonOrder: 0,
      cursor: 'default',
      hoverCursor: 'move',
      ensureSelectableObjects: true
    };

    this._setupOptions(options);
  };

  SelectionTool.prototype = Object.create(BaseTool.prototype);
  SelectionTool.prototype.constructor = SelectionTool;

  SelectionTool.prototype._activateTool = function () {
    BaseTool.prototype._activateTool.call(this);
    this._enableSelectionMode();
  };

  SelectionTool.prototype._deactivateTool = function () {
    BaseTool.prototype._deactivateTool.call(this);
  };

  SelectionTool.prototype._enableSelectionMode = function () {
    var fCanvas = this.drawerInstance && this.drawerInstance.fCanvas;
    if (!fCanvas) {
      return;
    }

    fCanvas.isDrawingMode = false;
    fCanvas.selection = true;
    fCanvas.defaultCursor = this.options.cursor;
    fCanvas.hoverCursor = this.options.hoverCursor;

    if (this.options.ensureSelectableObjects && fCanvas.forEachObject) {
      fCanvas.forEachObject(function (obj) {
        if (obj) {
          obj.selectable = true;
          obj.evented = true;
        }
      });
    }

    fCanvas.renderAll();
  };

  pluginsNamespace.SelectionTool = SelectionTool;

}(Easel.plugins.BaseTool, Easel.plugins));
