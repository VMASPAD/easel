(function (global) {

  'use strict';

  var fabric = global.fabric || (global.fabric = {}),
    extend = fabric.util.object.extend,
    min = fabric.util.array.min,
    max = fabric.util.array.max,
    toFixed = fabric.util.toFixed;

  fabric.SegmentablePolygon = fabric.util.createClass(fabric.ErasableObject, {
    /**
     * Type of an object
     * @type String
     * @default
     */
    type: 'segmentablePolygon',

    /**
     * Points array
     * @type Array[]
     * @default
     */
    points: null,

    /**
     * Minimum X from points values, necessary to offset points
     * @type Number
     * @default
     */
    minX: 0,

    /**
     * Minimum Y from points values, necessary to offset points
     * @type Number
     * @default
     */
    minY: 0,

    /**
     * List of options to show when object is selected
     * @type {String[]}
     */
    objectOptionsList : ['shapeFill', 'border', 'opacity'],

    /**
     * Constructor
     * @param {Array} points Array of points
     * @param {Object} [options] Options object
     * @return {fabric.Polygon} thisArg
     */
    initialize: function (points, options) {
      var _this = this;

      this.points = points;
      if (points === undefined) {
        console.error('Points should be array.');
      }
      options = options || {};

      // call super[ErasableObject].initialize()
      this.callSuper('initialize', options);

      this._calcDimensions();
      if (!('top' in options)) {
        this.top = this.minY;
      }
      if (!('left' in options)) {
        this.left = this.minX;
      }
    },

    /**
     * @private
     */
    _calcDimensions: function () {
      var minX = null;
      var minY = null;
      var maxX = null;
      var maxY = null;

      for (var i = 0; i < this.points.length; i++) {
        var _minX = min(this.points[i], 'x');
        if (minX === null || _minX < minX) {
          minX = _minX;
        }

        var _minY = min(this.points[i], 'y');
        if (minY === null || _minY < minY) {
          minY = _minY;
        }

        var _maxX = max(this.points[i], 'x');
        if (maxX === null || _maxX > maxX) {
          maxX = _maxX;
        }

        var _maxY = max(this.points[i], 'y');
        if (maxY === null || _maxY > maxY) {
          maxY = _maxY;
        }
      }

      this.width = (maxX - minX) || 1;
      this.height = (maxY - minY) || 1;

      this.minX = minX;
      this.minY = minY;
    },

    _fixPoints: function () {
      this._calcDimensions();

      if (this.minX != (this.width / 2) * -1 || this.minY != (this.height / 2) * -1) {
        this.points.forEach(function (pointSegment) {
          pointSegment.forEach(function (p) {
            p.x -= (this.minX + this.width / 2);
            p.y -= (this.minY + this.height / 2);
          }, this);
        }, this);
      }
    },


    /**
     * @private
     */
    _applyPointOffset: function () {
      // change points to offset polygon into a bounding box
      // executed one time
      this.points.forEach(function (pointSegment) {
        pointSegment.forEach(function (p) {
          p.x -= (this.minX + this.width / 2);
          p.y -= (this.minY + this.height / 2);
        }, this);
      }, this);
    },

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} Object representation of an instance
     */
    toObject: function (propertiesToInclude) {
      return extend(this.callSuper('toObject', propertiesToInclude), {
        points: this.points.concat(),
        type: this.type
      });
    },

    toSVG: function (reviver) {
      var markup = this._createBaseSVGMarkup(),
          segments = this.points || [],
          pathSegments = [],
          segment, i, j;

      for (i = 0; i < segments.length; i++) {
        segment = segments[i];
        if (!segment || !segment.length) {
          continue;
        }

        pathSegments.push('M ', toFixed(segment[0].x, 2), ' ', toFixed(segment[0].y, 2), ' ');
        for (j = 1; j < segment.length; j++) {
          pathSegments.push('L ', toFixed(segment[j].x, 2), ' ', toFixed(segment[j].y, 2), ' ');
        }
        pathSegments.push('z ');
      }

      if (!pathSegments.length) {
        return reviver ? reviver('') : '';
      }

      markup.push(
        '<path ', this.getSvgId(),
        'd="', pathSegments.join(''),
        '" style="', this.getSvgStyles(),
        '" transform="', this.getSvgTransform(), ' ', this.getSvgTransformMatrix(),
        '" />\n'
      );

      var svgMarkup = markup.join('');
      return reviver ? reviver(svgMarkup) : svgMarkup;
    },

    render: function (ctx, noTransform) {
      // fix some stroke issue, save old stroke
      if (this.points[0].length == 2) {
        this.oldStroke = this.stroke;
        this.oldStrokeDashArray = this.strokeDashArray;
        this.oldStrokeWidth = this.strokeWidth;

        this.stroke = this.fill;
        this.strokeWidth = 3;
        this.strokeDashArray = [];
      }

      // call super[ErasableObject].render
      this.callSuper('render', ctx, noTransform);

      // fix some stroke issue again, restore old stroke
      if (this.points[0].length == 2) {
        this.stroke = this.oldStroke;
        this.strokeDashArray = this.oldStrokeDashArray;
        this.strokeWidth = this.oldStrokeWidth;
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    _render: function (ctx) {
      this.commonRender(ctx);
      this._renderFill(ctx);
      if (this.stroke || this.strokeDashArray) {
        ctx.closePath();
        this._renderStroke(ctx);
      }
    },

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    commonRender: function (ctx) {
      var point;
      ctx.beginPath();

      if (this._applyPointOffset) {
        if (!(this.group && this.group.type === 'path-group')) {
          this._applyPointOffset();
        }
        this._applyPointOffset = null;
      }

      var firstSegment = this.points[0];

      // when we have only one point we should draw a small cirlce
      // so user could see it
      if(firstSegment.length == 1){
        var radius = 2;
        ctx.arc(firstSegment[0].x, firstSegment[0].y,
          radius, 0, 2 * Math.PI, false
        );
      }

      ctx.moveTo(firstSegment[0].x, firstSegment[0].y);
      for (var i = 0, len = firstSegment.length; i < len; i++) {
        point = firstSegment[i];
        ctx.lineTo(point.x, point.y);
      }

      ctx.closePath();

      if (this.points.length > 1) {
        for (var s = 1; s < this.points.length; s++) {
          var segmentPoints = this.points[s];
          ctx.moveTo(segmentPoints[0].x, segmentPoints[0].y);

          for (var sp = 0; sp < segmentPoints.length; sp++) {
            ctx.lineTo(segmentPoints[sp].x, segmentPoints[sp].y);
          }

        }
      }
    },


    /**
     * Returns complexity of an instance
     * @return {Number} complexity of this instance
     */
    complexity: function () {
      var sum = 0;
      for (var i = 0; i < this.points.length; i++) {
        sum += this.points[i].length;
      }
      return sum;
    }

  });

  /**
   * Returns fabric.Polygon instance from an object representation
   * @static
   * @memberOf fabric.Polygon
   * @param {Object} object Object to create an instance from
   * @return {fabric.Polygon} Instance of fabric.Polygon
   */
  fabric.SegmentablePolygon.fromObject = function (object) {
    return new fabric.SegmentablePolygon(object.points, object, true);
  };

})(typeof exports !== 'undefined' ? exports : this);