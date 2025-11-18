(function (Easel) {
  /**
   *
   * @param {Easel.Easel} drawer - instance of drawer
   * @memberOf Easel
   * @constructor
   */
    var EaselApi = function(drawer) {
        if (!drawer) {
            throw new Error('EaselApi(): no drawer is provided!');
        }
        this.drawer = drawer;
    };

    EaselApi.prototype.drawer = null;

    // Easel core API
    ////////////////////////////////////////////////////////////////////////

    /**
     * Starts editing mode.
     * If already in this mode - do nothing.
     */
    EaselApi.prototype.checkIsActive = function () {
        if (this.drawer.mode != this.drawer.MODE_ACTIVE) {
            throw new Error("Easel is not active!");
        }
    };


    /**
     * Starts editing mode.
     * If already in this mode - do nothing.
     */
    EaselApi.prototype.startEditing = function () {
        this.drawer._startEditing();
    };

    /**
     * Stops editing.
     * If already stopped, ie. in INACTIVE_MODE - do nothing.
     */
    EaselApi.prototype.stopEditing = function () {
        this.drawer._stopEditing();
    };



    /**
     * Get serialized in JSON string canvas data.
     * @returns [String]
     */
    EaselApi.prototype.getCanvasAsJSON = function () {
        this.drawer.api.checkIsActive();
        return this.drawer.getSerializedCanvas();
    };


    /**
     * Save canvas.
     * Syncs drawer canvas data with storages, defined in options
     */
    EaselApi.prototype.saveCanvas = function () {
        this.drawer.api.checkIsActive();
        this.drawer.syncCanvasData();
    };


    /**
     * Load canvas.
     * Loads canvas
     */
    EaselApi.prototype.loadCanvasFromData = function (data) {
        this.drawer.loadCanvas(data);
    };



 /**
   * Returns data-url with image encoded to base64.
   *
   * @see Easel.Storage.js getImageData() for details
   * @returns {String} image data encoded in base64/png.
   */
   EaselApi.prototype.getCanvasAsImage = function () {
        return this.drawer.getImageData();
   };


    /**
     * Save canvas as image in storages, as defined in config
     */
    EaselApi.prototype.saveCanvasImage = function () {
        this.drawer.api.checkIsActive();
        this.drawer.syncImageData();
    };

  /**
   * List of all available options for each mode of each toolbar
   * @typedef {Object} sizesOfEasel
   * @memberOf Easel.EaselApi
   * @property {Number} width - width of Easel
   * @property {Number} height - height of drawer
   * @property {Number} scrollTop - "Top" position including scrollTop value of parent elements
   * @property {Number} scrollLeft - "Left" position including scrollLeft value of parent elements
   * @property {Number} top - Absolute value of "top" position
   * @property {Number} left - Absolute value of "left" position
   */


  /**
     * Get sizes of drawer
     * @returns {Easel.EaselApi.sizesOfEasel}
     */
    EaselApi.prototype.getSize = function () {
      var sizes = this.drawer.getSize();
      return sizes;
    };

  /**
     * Sets drawer size.
     */
    EaselApi.prototype.setSize = function (width, height) {
        this.drawer.setSize(width, height);
    };

    /**
     * Set active color
     * @param {String} color - New color value (HEX)
     */
    EaselApi.prototype.setActiveColor = function (color) {
      this.drawer.setActiveColor(color);
    };

  /**@
   * Create text object
   * @param {Number} [positionX=0] - left offset of new text object
   * @param {Number} [positionY=0] - top offset of new text object
   * @param {String} [text="Text"] - text of new object
   * @param {Object} [styles] - styles for new text object
   */
  EaselApi.prototype.createText = function (positionX, positionY, text, styles) {
    this.drawer._pluginsInstances.Text.addShape(positionX, positionY, text, styles);
  };


    /**
     * Update current options.
     * If optionsToUpdate has plugins key, plugins will be reloaded
     *
     * @param  {Object} optionsToUpdate options object
     */
    EaselApi.prototype.updateOptions = function (optionsToUpdate) {
        this.drawer.updateOptions(optionsToUpdate);
    };


    /**
     * Update current options.
     * All plugins will be reloaded
     *
     * @param  {Object} optionsToUpdate options object
     */
    EaselApi.prototype.setOptions = function (newOptions) {
        this.drawer.setOptions(newOptions);
    };


    /**
     * Load plugin by name.
     * Name must exists in Easel namespace.
     * If plugin is already loaded, error will be thrown
     *
     * @param  {String} pluginName plugin name
     */
    EaselApi.prototype.loadPlugin = function (pluginName) {
        this.drawer.loadPlugin(pluginName);
    };


    /**
     * Unload plugin by name.
     * If plugin is not loaded, nothing happens.
     *
     * @param  {String} pluginName plugin name
     */
    EaselApi.prototype.unloadPlugin = function (pluginName) {
        this.drawer.unloadPlugin(pluginName);
    };

    Easel.EaselApi = EaselApi;
})(Easel);
