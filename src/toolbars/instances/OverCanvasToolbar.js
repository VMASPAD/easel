  /**
   * Toolbar with floating buttons
   *
   * @param {Easel.Easel} drawerInstance
   * @param {Object} [options]
   * @extends EaselToolbar
   * @constructor
   */
  var OverCanvasToolbar = function (drawerInstance, options) {
    options = options || {};
    // css class for toolbar
    options.toolbarClass = EaselToolbar.FLOATING_CLASS || 'drawer-toolbar--floating';
    // call EaselToolbar c-tor
    EaselToolbar.call(this, drawerInstance, options);
    // cry loud of birth
    drawerInstance.trigger(drawerInstance.EVENT_FLOATING_TOOLBAR_CREATED, [this]);
  };

  OverCanvasToolbar.prototype = Object.create(EaselToolbar.prototype);
  OverCanvasToolbar.prototype.constructor = EaselToolbar;