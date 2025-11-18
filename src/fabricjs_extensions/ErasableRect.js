(function (global) {
  'use strict';

  var fabric = global.fabric || (global.fabric = {});

  if (!fabric.Rect) {
    return;
  }

  fabric.ErasableRect = fabric.util.createClass(fabric.Rect, {
    type: 'ErasableRect',
    objectOptionsList: ['shapeFill', 'border', 'opacity'],
    initialize: function (options) {
      options = options || {};
      this.callSuper('initialize', options);
    },
    toObject: function (propertiesToInclude) {
      return fabric.util.object.extend(
        this.callSuper('toObject', propertiesToInclude),
        {}
      );
    }
  });

  fabric.ErasableRect.fromObject = function (object) {
    return new fabric.ErasableRect(object);
  };

  fabric.ErasableRect.async = false;

  fabric.makeObjectErasable(fabric.ErasableRect);

})(typeof exports !== 'undefined' ? exports : this);
