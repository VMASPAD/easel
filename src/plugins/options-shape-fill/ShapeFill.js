(function ($, pluginsNamespace, BaseToolOptions, util) {
  "use strict";

  var ShapeFill = function ShapeFillConstructor(drawer, options) {
    BaseToolOptions.call(this, drawer);

    this.optionName = 'shapeFill';
    this.name = 'ShapeFill';
    this._setupOptions(options);

    this.currentFill = this.drawer.activeColor || (this.options && this.options.defaultFill) || '#ffffff';
    this.colorpicker = new pluginsNamespace.ColorpickerControl(this.drawer, {
      colorText: this.drawer.t('Fill'),
      buttonOrder: this.options.buttonOrder
    });

    this._bindedOnObjectAdded = this._onObjectAdded.bind(this);
    this.drawer.on(this.drawer.EVENT_OBJECT_ADDED, this._bindedOnObjectAdded);
  };

  ShapeFill.prototype = Object.create(BaseToolOptions.prototype);
  ShapeFill.prototype.constructor = BaseToolOptions;

  ShapeFill.prototype._defaultOptions = {
    buttonOrder: 4,
    defaultFill: '#ffffff'
  };

  ShapeFill.prototype.createControls = function (toolbar) {
    this.$control = this.colorpicker.createControl(toolbar, this.onFillSelected.bind(this));
    this.colorpicker.setColor(this.currentFill);
    this.hideControls();
  };

  ShapeFill.prototype.onFillSelected = function (color) {
    if (!color) {
      return;
    }

    this.currentFill = color;
    this._applyFillToActiveObject(color);
    this.drawer.setColor(color);
  };

  ShapeFill.prototype._applyFillToActiveObject = function (color) {
    if (!this.drawer.fCanvas) {
      return;
    }

    var activeObject = this.drawer.fCanvas.getActiveObject();
    if (activeObject && util.isShape(activeObject) && !activeObject.path) {
      activeObject.set('fill', color);
      this.drawer.fCanvas.renderAll();
    }
  };

  ShapeFill.prototype.updateControlsFromObject = function (target) {
    if (!target || !util.isShape(target)) {
      return;
    }

    var fill = target.get('fill');
    if (fill) {
      this.currentFill = fill;
      this.colorpicker.setColor(fill);
    }
  };

  ShapeFill.prototype._onObjectAdded = function (evt, fabricEvent) {
    var target = fabricEvent && fabricEvent.target;
    if (target && util.isShape(target) && !target.path) {
      target.set('fill', this.currentFill || this.drawer.activeColor);
      this.drawer.fCanvas.renderAll();
    }
  };

  ShapeFill.prototype.showControls = function () {
    this.colorpicker.showControls();
  };

  ShapeFill.prototype.hideControls = function () {
    this.colorpicker.hideControls();
  };

  ShapeFill.prototype.removeTool = function () {
    BaseToolOptions.prototype.removeTool.call(this);
    if (this._bindedOnObjectAdded) {
      this.drawer.off(this.drawer.EVENT_OBJECT_ADDED, this._bindedOnObjectAdded);
    }
  };

  pluginsNamespace.ShapeFill = ShapeFill;
})(jQuery, Easel.plugins, Easel.plugins.BaseToolOptions, Easel.util);
