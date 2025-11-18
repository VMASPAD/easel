(function(global) {
    'use strict';

    var fabric = global.fabric || (global.fabric = {});

    fabric.ErasablePencilBrush = fabric.util.createClass(fabric.PencilBrush, {

        type: 'ErasablePencilBrush',

        /**
         * List of tool options to show when object is selected
         * @type {String[]}
         */
        objectOptionsList : ['color', 'opacity', 'brush'],
        enableHandDrawnEffect: false,
        handDrawnStyle: 'sketch',
        handDrawnRoughness: 0.85,
        handDrawnShadowOffset: 0.9,
        handDrawnSketchLines: 1,
        handDrawnSketchOffset: 0.65,
        penDecimate: 3,
        penSmoothing: 2,


      /**
       * Overriding fabric.PencilBrush.onMouseMove
       * Method code is exactly copy of fabric.PencilBrush.onMouseMove,
       * only change is trigger events
       *
       * @param {Object} pointer - object with "x" and "y" values
       * @see {fabric.PencilBrush.onMouseMove}
       */
      onMouseMove: function(pointer) {
        this._captureDrawingPath(pointer);
        // redraw curve
        // clear top canvas

        this.canvas.clearContext(this.canvas.contextTop);
        // this.canvas.fire('pencil:move:before');
        this._render();
        // this.canvas.fire('pencil:move:after');
        this.canvas.renderAll();
      },

      /**
       * Overriding fabric.PencilBrush._render
       * Method code is exactly copy of fabric.PencilBrush._render,
       * only change is trigger events
       *
       * @see {fabric.PencilBrush._render}
       * @private
       */
      _render: function () {
        this.canvas.fire('pencil:move:before');
        this.callSuper('_render');
        this.canvas.fire('pencil:move:after');
      },

      _finalizeAndAddPath: function () {
        if (this._shouldApplyPenPreprocessing()) {
          this._preprocessPenPoints();
        }
        this.callSuper('_finalizeAndAddPath');
      },

        initialize: function(canvas, options) {
            options = options || {};
            // parent c-tor has no options argument, so adding them here
            this.options = options;
            // call parent c-tor
            this.callSuper('initialize', canvas);
        },


        /**
         * Overriding fabric.PencilBrush.createPath
         * Method code is exactly copy of fabric.PencilBrush.createPath,
         * only change is creating fabric.ErasablePath instead of fabric.Path
         *
         * Creates fabric.ErasablePath object to add on canvas
         * @param {String} pathData Path data
         * @return {fabric.Path} Path to add on canvas
         * @see {fabric.PencilBrush.createPath}
         */
        createPath: function(pathData) {
            var path = new fabric.ErasablePath(pathData, {
                fill: null,
                stroke: this.color,
                opacity: this.opacity,
                strokeWidth: this.width,
                strokeLineCap: this.strokeLineCap,
                strokeLineJoin: this.strokeLineJoin,
                strokeDashArray: this.strokeDashArray,
                originX: 'center',
                originY: 'center'
            });

            if (this.shadow) {
                this.shadow.affectStroke = true;
                path.setShadow(this.shadow);
            }

            if (this.enableHandDrawnEffect) {
              this._applyHandDrawnEffect(path);
            }

            return path;
          },

          _applyHandDrawnEffect: function (path) {
            this._simplifyPenPath(path);
            if (this.handDrawnStyle === 'pen') {
              this._applyPenEffect(path);
              return;
            }

            var baseCommands = this._roughenPath(path);
            if (this.handDrawnSketchLines > 1 && baseCommands) {
              this._addSketchOutlines(path, baseCommands);
            }
            this._applyStrokeShadow(path);
          },

          _applyPenEffect: function (path) {
            if (!path) {
              return;
            }
            path.strokeLineCap = 'round';
            path.strokeLineJoin = 'round';
            path.strokeMiterLimit = 2;
            path.strokeUniform = true;
            path.paintFirst = 'stroke';
            if (path.setShadow) {
              path.setShadow(null);
            } else {
              path.shadow = null;
            }
            path.dirty = true;
          },

          _roughenPath: function (path) {
            if (!path || !path.path) {
              return null;
            }
            var baseCopy = this._clonePathCommands(path.path);
            var jitterScale = this._resolveJitterScale(path);
            var wobbledPath = [];
            for (var i = 0; i < path.path.length; i++) {
              var command = path.path[i];
              var updatedCommand = [command[0]];
              for (var j = 1; j < command.length; j++) {
                var value = command[j];
                if (typeof value === 'number') {
                  updatedCommand[j] = value + this._sketchRandom(jitterScale, command[0]);
                } else {
                  updatedCommand[j] = value;
                }
              }
              wobbledPath.push(updatedCommand);
            }
            path.path = wobbledPath;
            path.dirty = true;
            return baseCopy;
          },

          _resolveJitterScale: function (path) {
            var width = path.strokeWidth || this.width || 1;
            var base = Math.max(width * 0.35, 0.6);
            return base * (this.handDrawnRoughness || 1);
          },

          _sketchRandom: function (scale, commandName) {
            var multiplier = (commandName === 'Q' || commandName === 'C') ? 1.8 : 1.2;
            return (Math.random() - 0.5) * 2 * scale * multiplier;
          },

          _addSketchOutlines: function (path, baseCommands) {
            var outlines = Math.max(0, Math.round(this.handDrawnSketchLines || 1) - 1);
            if (!outlines) {
              return;
            }
            var baseScale = this._resolveJitterScale(path) * (this.handDrawnSketchOffset || 0.65);
            for (var i = 0; i < outlines; i++) {
              var scale = baseScale * (1 + (i * 0.35));
              var outlineCommands = this._buildOutlineCommands(baseCommands, scale);
              if (outlineCommands.length) {
                if (outlineCommands[0][0] !== 'M' && outlineCommands[0][0] !== 'm') {
                  outlineCommands[0][0] = 'M';
                }
                path.path = path.path.concat(outlineCommands);
              }
            }
            path.dirty = true;
          },

          _buildOutlineCommands: function (commands, scale) {
            var outline = [];
            for (var i = 0; i < commands.length; i++) {
              var command = commands[i];
              var cloned = [command[0]];
              for (var j = 1; j < command.length; j++) {
                var value = command[j];
                if (typeof value === 'number') {
                  cloned[j] = value + this._sketchRandom(scale, command[0]);
                } else {
                  cloned[j] = value;
                }
              }
              outline.push(cloned);
            }
            return outline;
          },

          _clonePathCommands: function (commands) {
            var clone = [];
            for (var i = 0; i < commands.length; i++) {
              var command = commands[i];
              var copied = [];
              for (var j = 0; j < command.length; j++) {
                copied[j] = command[j];
              }
              clone.push(copied);
            }
            return clone;
          },

          _applyStrokeShadow: function (path) {
            if (!path) {
              return;
            }
            var offset = this.handDrawnShadowOffset || 0.9;
            path.strokeLineCap = 'round';
            path.strokeLineJoin = 'round';
            if (!path.shadow) {
              path.setShadow(new fabric.Shadow({
                color: path.stroke,
                blur: 0,
                offsetX: offset,
                offsetY: offset,
                opacity: 0.5
              }));
              path.shadow.affectStroke = true;
            }
          },

          _simplifyPenPath: function (path) {
            if (!path || !path.path) {
              return;
            }
            var simplified = [];
            var lastX;
            var lastY;
            for (var i = 0; i < path.path.length; i++) {
              var command = path.path[i];
              var clone = command.slice();
              var lastIndex = command.length - 2;
              if (lastIndex >= 1) {
                var x = command[lastIndex];
                var y = command[lastIndex + 1];
                if (typeof x === 'number' && typeof y === 'number') {
                  if (lastX === x && lastY === y) {
                    continue;
                  }
                  lastX = x;
                  lastY = y;
                }
              }
              simplified.push(clone);
            }
            path.path = simplified;
          },

          _shouldApplyPenPreprocessing: function () {
            return this.enableHandDrawnEffect &&
              this.handDrawnStyle === 'pen' &&
              this._points && this._points.length > 2;
          },

          _preprocessPenPoints: function () {
            if (!this._points || !this._points.length) {
              return;
            }
            var minDistance = this.penDecimate || 3;
            var smoothingWindow = this.penSmoothing || 0;
            var decimated = this._decimatePenPoints(this._points, minDistance);
            if (smoothingWindow > 1) {
              decimated = this._smoothPenPoints(decimated, smoothingWindow);
            }
            this._points = decimated;
          },

          _decimatePenPoints: function (points, minDistance) {
            if (!points || points.length < 3) {
              return points ? points.slice() : [];
            }
            var threshold = Math.max(minDistance || 2, 1);
            var filtered = [];
            var previous = points[0];
            filtered.push(this._clonePoint(previous));
            var accumulated = 0;

            for (var i = 1; i < points.length - 1; i++) {
              var current = points[i];
              var distance = previous.distanceFrom ? previous.distanceFrom(current) :
                Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2));
              accumulated += distance;
              if (accumulated >= threshold) {
                filtered.push(this._clonePoint(current));
                previous = current;
                accumulated = 0;
              }
            }

            var lastPoint = points[points.length - 1];
            filtered.push(this._clonePoint(lastPoint));

            return filtered;
          },

          _smoothPenPoints: function (points, windowSize) {
            if (!points || points.length < 3) {
              return points ? points.slice() : [];
            }
            var radius = Math.max(Math.round(windowSize), 1);
            var smoothed = [];

            for (var i = 0; i < points.length; i++) {
              var start = Math.max(0, i - radius);
              var end = Math.min(points.length - 1, i + radius);
              var count = 0;
              var sumX = 0;
              var sumY = 0;

              for (var j = start; j <= end; j++) {
                sumX += points[j].x;
                sumY += points[j].y;
                count++;
              }

              smoothed.push(new fabric.Point(sumX / count, sumY / count));
            }

            return smoothed;
          },

          _clonePoint: function (point) {
            if (!point) {
              return new fabric.Point(0, 0);
            }
            return point.clone ? point.clone() : new fabric.Point(point.x, point.y);
          }

    });

})(typeof exports !== 'undefined' ? exports : this);
