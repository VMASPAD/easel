(function($, BaseShape, pluginsNamespace, util) {
  /**
   * Provides a diamond button which can be used to draw rhombus shapes.
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
   * <code>normal</code>: diamond's top left corner will be placed to the
   * position of first mouse click and will be resized from that point.
   * <br><br>
   * <code>from_center</code>: diamond's center point will be placed to the
   * position of first mouse click and will be resized from center.
   *
   * @constructor
   * @memberof Easel.plugins
   */
  var Diamond = function DiamondConstructor(drawerInstance, options) {
    var _this = this;

    BaseShape.call(_this, drawerInstance);

    this.name = 'Diamond';
    this.btnClass = 'btn-diamond';
    this.faClass = 'fa-diamond';
    this.tooltip = drawerInstance.t('Draw a diamond');

    this.options = options || {};
    this.centeringMode =
      this.options.centeringMode || BaseShape.CENTERING_MODE.NORMAL;
  };

  Diamond.prototype = Object.create(BaseShape.prototype);
  Diamond.prototype.constructor = Diamond;

  BaseShape.prototype.minShapeSize = 8;

  Diamond.prototype.createShape = function (left, top) {
    this.startLeft = left;
    this.startTop = top;

    var diamond = new fabric.PDiamond({
      width: 1,
      height: 1,
      left: left,
      top: top,
      fill: this.drawerInstance.activeColor,
      opacity: this.drawerInstance.activeOpacity,
      stroke: this.drawerInstance.activeColor,
      strokeWidth: 2
    });

    util.applyStrokePenStyle(diamond);

    return diamond;
  };

  Diamond.prototype.updateShape = function (diamond, newLeft, newTop) {
    var width = newLeft - this.startLeft;
    var height = newTop - this.startTop;

    if (this.centeringMode === BaseShape.CENTERING_MODE.FROM_CENTER) {
      width *= 2;
      height *= 2;
      diamond.set('left', newLeft - width);
      diamond.set('top', newTop - height);
    }

    if (width > 0) {
      diamond.set('width', width);
    } else {
      diamond.set('left', newLeft);
      diamond.set('width', width * -1);
    }

    if (height > 0) {
      diamond.set('height', height);
    } else {
      diamond.set('top', newTop);
      diamond.set('height', height * -1);
    }
  };

  pluginsNamespace.Diamond = Diamond;

}(jQuery, Easel.plugins.BaseShape, Easel.plugins, Easel.util));
