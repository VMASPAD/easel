(function($, BaseShape, pluginsNamespace, util) {
  /**
   * Provides a rectangle button which can be used to draw rectangles.
   *
   * @param {Easel.Easel} drawerInstance
   * Instance of {@link Easel.Easel}.
   *
   * @param {Object} options
   * Configuration object.
   *
   * @param {String} [options.centeringMode='normal']
   * Defines centering method when drawing a shape.
   * <br><br>
   * Valid values are:
   * <br><br>
   * <code>normal</code>: rectangle's top left corner will be placed to the
   * position of first mouse click and will be resized from that point.
   * <br><br>
   * <code>from_center</code>: rectangle's center point will be placed to the
   * position of first mouse click and will be resized from center.
   *
   * @constructor
   * @memberof Easel.plugins
   */
  var Rectangle = function RectangleConstructor(drawerInstance, options) {
    var _this = this;

    BaseShape.call(_this, drawerInstance);

    this.name = 'Rectangle';
    this.btnClass = 'btn-rectangle';
    this.faClass = 'fa-stop';
    this.tooltip = drawerInstance.t('Draw a rectangle');

    this.options = options || {};
    this.centeringMode =
      this.options.centeringMode || BaseShape.CENTERING_MODE.NORMAL;
  };

  Rectangle.prototype = Object.create(BaseShape.prototype);
  Rectangle.prototype.constructor = Rectangle;

  Rectangle.prototype.createShape = function (left, top) {
    this.startLeft = left;
    this.startTop = top;

    var rect = new fabric.ErasableRect({
      left: left,
      top: top,
      height: 1,
      width: 1,
      rx: 7,
      ry: 7,
      fill: this.drawerInstance.activeColor,
      opacity: this.drawerInstance.activeOpacity,
      stroke: this.drawerInstance.activeColor,
      strokeWidth: 2,
      erasable: true
    });

    rect.isErasable = true;
    rect.set('erasable', true);

    this._applyActiveBorderStyle(rect);

    util.applyStrokePenStyle(rect);

    return rect;
  };

  Rectangle.prototype.updateShape = function (rectangle, newLeft, newTop) {
    var width = newLeft - this.startLeft;
    var height = newTop - this.startTop;

    if (this.centeringMode == BaseShape.CENTERING_MODE.FROM_CENTER) {
      width *= 2;
      height *= 2;
      rectangle.set('left', newLeft - width);
      rectangle.set('top', newTop - height);
    }

    if(width > 0){
      rectangle.set('width', width);
    } else {
      rectangle.set('left', newLeft);
      rectangle.set('width', width * -1);
    }

    if(height > 0){
      rectangle.set('height', height);
    } else {
      rectangle.set('top', newTop);
      rectangle.set('height', height * -1);
    }

  };

  Rectangle.prototype._applyActiveBorderStyle = function (rectangle) {
    if (!rectangle) {
      return;
    }

    var borderPlugin = this._getShapeBorderPlugin();
    if (borderPlugin && typeof borderPlugin.applyBorderStyle === 'function') {
      borderPlugin.applyBorderStyle(rectangle);
    } else if (borderPlugin && borderPlugin.currentBorder) {
      var border = borderPlugin.currentBorder;
      rectangle.set('stroke', border.color || borderPlugin.currentColor);
      rectangle.set('strokeWidth', border.width);
      rectangle.set('strokeDashArray', border.dashArray || null);
      util.applyStrokePenStyle(rectangle);
    }
  };

  Rectangle.prototype._getShapeBorderPlugin = function () {
    var plugins = this.drawerInstance && this.drawerInstance._pluginsInstances;
    if (plugins && plugins.ShapeBorder) {
      return plugins.ShapeBorder;
    }
    return null;
  };

  pluginsNamespace.Rectangle = Rectangle;

}(jQuery, Easel.plugins.BaseShape, Easel.plugins, Easel.util));