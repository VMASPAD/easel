/**
 * Toolbar where will be close, move, fullscreen, open settigs buttons.
 *
 * @param {Easel.Easel} drawerInstance
 * @param {Object} [options]
 * @extends EaselToolbar
 * @constructor
 */
var SettingsToolbar = function (drawerInstance, options) {
  options = options || {};
  options.toolbarClass = 'tool-settings-toolbar';
  // call super c-tor
  EaselToolbar.call(this, drawerInstance, options);

  // create default buttons for tghi toolbart
  this._createDefaultButtons();

  // Trigger event
  drawerInstance.trigger(drawerInstance.EVENT_CONFIG_TOOLBAR_CREATED, [this]);
};

SettingsToolbar.prototype = Object.create(EaselToolbar.prototype);
SettingsToolbar.prototype.constructor = EaselToolbar;


/**
 * Creates defaults buttons : close.
 * @private
 */
SettingsToolbar.prototype._createDefaultButtons = function() {
};

