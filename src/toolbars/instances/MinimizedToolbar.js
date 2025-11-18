  /**
   * Toolbar with floating buttons
   *
   * @param {Easel.Easel} drawerInstance
   * @param {Object} [options]
   * @extends EaselToolbar
   * @constructor
   */
  var MinimizedToolbar = function (drawerInstance, options) {
    options = options || {};
    // css class for toolbar
    options.toolbarClass = 'tool-minimized-toolbar';
    // call EaselToolbar c-tor
    EaselToolbar.call(this, drawerInstance, options);
    // cry loud of birth
    drawerInstance.trigger(drawerInstance.EVENT_MINIMIZED_TOOLBAR_CREATED, [this]);
  };

  MinimizedToolbar.prototype = Object.create(EaselToolbar.prototype);
  MinimizedToolbar.prototype.constructor = EaselToolbar;