(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
    extend = fabric.util.object.extend;

  fabric.PDiamond = fabric.util.createClass(fabric.SegmentablePolygon, {
    type: 'PDiamond',
    initialize: function (options) {
      options = options || {};

      this.width = options.width || 10;
      this.height = options.height || 10;

      var points = this.makeDiamond(this.width, this.height);

      this.callSuper('initialize', points, options);
    },
    makeDiamond: function (width, height) {
      var halfWidth = width / 2;
      var halfHeight = height / 2;

      var points = [
        {x: 0, y: halfHeight * -1},
        {x: halfWidth, y: 0},
        {x: 0, y: halfHeight},
        {x: halfWidth * -1, y: 0}
      ];

      return [points];
    },
    _render: function (ctx) {
      this.callSuper('_render', ctx);
    },
    _set: function (key, value) {
      var dimensionsChanged = false;
      if (key === 'width') {
        this.width = value;
        dimensionsChanged = true;
      }
      if (key === 'height') {
        this.height = value;
        dimensionsChanged = true;
      }
      if (dimensionsChanged) {
        this.points = this.makeDiamond(this.width, this.height);
        this.callSuper('_set', 'points', this.points);
      }

      this.callSuper('_set', key, value);
    },
    toObject: function (propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        width: this.width,
        height: this.height
      });
    }
  });


  fabric.PDiamond.fromObject = function (object) {
    return new fabric.PDiamond(object, true);
  };

  fabric.PDiamond.async = false;

})(typeof exports !== 'undefined' ? exports : this);
