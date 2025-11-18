/**
 * Toolbar where will be buttons for image cropper
 *
 * @param {Easel.Easel} drawerInstance
 * @param {Object} [options]
 * @extends EaselToolbar
 * @constructor
 */
var CropImageToolbar = function (drawerInstance, options) {
  options = options || {};
  options.toolbarClass = 'tool-cropimage hidden';
  // call super c-tor
  EaselToolbar.call(this, drawerInstance, options);

  // create default buttons for toolbar
  this._createDefaultButtons();

  // Trigger event
  drawerInstance.trigger(drawerInstance.EVENT_IMAGECROP_TOOLBAR_CREATED, [this]);
};

CropImageToolbar.prototype = Object.create(EaselToolbar.prototype);
CropImageToolbar.prototype.constructor = EaselToolbar;


/**
 * Creates defaults buttons.
 */
CropImageToolbar.prototype._createDefaultButtons = function() {
};