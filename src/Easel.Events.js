(function (Easel) {
  /**
   * This event is triggered every time user clicks on canvas to edit it.
   * @type {string}
   */
  Easel.prototype.EVENT_EDIT_START = 'editStart';
  /**
   * This event is triggered every time user stops editing canvas.
   * @type {string}
   */
  Easel.prototype.EVENT_EDIT_STOP = 'editStop';
  /**
   * This event is triggered when canvas is deserialized
   * from image's attributes.
   * @type {string}
   */
  Easel.prototype.EVENT_LOADED_FROM_JSON = 'loadedFromJson';
  /**
   * This event is triggered when canvas is deserialized, and is ready to work.
   * @type {string}
   */
  Easel.prototype.EVENT_CANVAS_READY = 'ready';
  /**
   * This event is triggered after canvas resizing starts
   * from image's attributes.
   * @type {string}
   */
  Easel.prototype.EVENT_CANVAS_START_RESIZE = 'canvas:resize:start';

  /**
   * This event is triggered after canvas resizing starts
   * from image's attributes.
   * @type {string}
   */
  Easel.prototype.EVENT_BEFORE_RENDER = 'before:render';


  /**
   * This event is triggered after canvas resizing starts
   * from image's attributes.
   * @type {string}
   */
  Easel.prototype.EVENT_AFTER_RENDER = 'after:render';
  /**
   * This event is triggered in process of canvas resize
   * from image's attributes.
   * @type {string}
   */
  Easel.prototype.EVENT_CANVAS_RESIZING = 'canvas:resize:resizing';
  /**
   * This event is triggered after canvas resize stopped
   * from image's attributes.
   * @type {string}
   */
  Easel.prototype.EVENT_CANVAS_STOP_RESIZE = 'canvas:resize:stop';
  /**
   * This event is triggered every time user changes a brush size.
   * @type {string}
   */
  Easel.prototype.EVENT_BRUSH_SIZE_CHANGED = 'brushSizeChanged';
  /**
   * This event is triggered every time user selects a tool that changes
   * free drawing brush.
   * @type {string}
   */
  Easel.prototype.EVENT_BRUSH_CHANGED = 'brushChanged';

  /**
   * Triggering this event will cause tool based on BaseTool to activate
   * @type {string}
   */
  Easel.prototype.EVENT_DO_ACTIVATE_TOOL = 'activateTool';
  /**
   * Triggering this event will cause tool based on BaseTool to deactivate
   * @type {string}
   */
  Easel.prototype.EVENT_DO_DEACTIVATE_TOOL = 'deactivateTool';
  /**
   * Triggering this event will cause to all tools based on BaseTool to deactivate.
   * This event is part of lifecycle of EVENT_DO_ACTIVATE_TOOL,
   * and is triggered every time after tool reacts on EVENT_DO_ACTIVATE_TOOL
   * @type {string}
   */
  Easel.prototype.EVENT_DO_DEACTIVATE_ALL_TOOLS = 'deactivateAllTools';

  /**
   * Event emitted, when options have changed.
   * In most cases - if user opened used 'CanvasProperties' plugin.
   * @type {String}
   */
  Easel.prototype.EVENT_OPTIONS_CHANGED = 'options.changed';
  /**
   * This event is triggered when user removes canvas from page.
   * @type {string}
   */
  Easel.prototype.EVENT_DESTROY = 'destroy';


  Easel.prototype.EVENT_TOOL_ACTIVATED = 'toolActivated';

  Easel.prototype.EVENT_TOOL_DEACTIVATED = 'toolDeactivated';

  Easel.prototype.EVENT_TOOLS_TOOLBAR_CREATED = 'toolsToolbarCreated';

  /**
   * This event is triggered when options toolbar is created and provides a way
   * to add buttons to it.
   * The second argument for this event is {EaselToolbar} and can be used
   * to manipulate with t.
   *
   * @type {string}
   */

  Easel.prototype.BEFORE_CREATE_TOOLBARS ='beforeCreateToolbars';

  Easel.prototype.AFTER_CREATE_TOOLBARS ='afterCreateToolbars';

  Easel.prototype.EVENT_OPTIONS_TOOLBAR_CREATED ='optionsToolbarCreated';

  Easel.prototype.EVENT_CONFIG_TOOLBAR_CREATED = 'configToolbarCreated';

  Easel.prototype.EVENT_IMAGECROP_TOOLBAR_CREATED = 'imageCropToolbarCreated';

  Easel.prototype.EVENT_FLOATING_TOOLBAR_CREATED = 'floatingToolbarCreated';

  Easel.prototype.EVENT_MINIMIZED_TOOLBAR_CREATED = 'minimizedToolbarCreated';

  Easel.prototype.EVENT_TOOLBAR_DESTROYED = 'toolbarDestroyed';

  Easel.prototype.EVENT_TOOLBAR_CHANGE_STATE = 'toolbarChangeState';

  Easel.prototype.EVENT_TOOLBAR_CLEAR_STATE = 'toolbarClearState';

  Easel.prototype.EVENT_TOOLBAR_STATE_HIDDEN_OFF = 'toolbarShow';

  Easel.prototype.EVENT_TOOLBAR_STATE_HIDDEN_ON = 'toolbarHide';

  Easel.prototype.EVENT_TOOLBAR_STATE_OVERLAY_ON = 'toolbarOverlayShow';

  Easel.prototype.EVENT_TOOLBAR_STATE_OVERLAY_OFF = 'toolbarOverlayHide';

  Easel.prototype.EVENT_TOOLBAR_STATE_DISABLED_ON = 'toolbarDisableOn';

  Easel.prototype.EVENT_TOOLBAR_STATE_DISABLED_OFF = 'toolbarDisableOff';

  Easel.prototype.EVENT_RESTORE_DEFAULT_ZOOM = 'restoreDefaultZoom';

  Easel.prototype.EVENT_CONTEXTMENU = 'contextmenu';

  Easel.prototype.EVENT_KEYDOWN = 'keydown';

  Easel.prototype.EVENT_BEFORE_SHAPE_ADD = 'beforeShapeAdd';

  Easel.prototype.EVENT_AFTER_SHAPE_ADD = 'afterShapeAdd';

  Easel.prototype.EVENT_ZOOM_SET = 'EVENT_ZOOM_SET';

  Easel.prototype.EVENT_ZOOM_UNSET = 'EVENT_ZOOM_UNSET';

  Easel.prototype.EVENT_ZOOM_UPPER_SET = 'EVENT_ZOOM_UPPER_SET';

  Easel.prototype.EVENT_ZOOM_UPPER_UNSET = 'EVENT_ZOOM_UPPER_UNSET';

  Easel.prototype.EVENT_ZOOM_UPPER_RESTORE = 'EVENT_ZOOM_UPPER_RESTORE';

  Easel.prototype.EVENT_ZOOM_RESTORE = 'EVENT_ZOOM_RESTORE';


  Easel.prototype.EVENT_ZOOM_CHANGE = 'zoomChange';

  Easel.prototype.EVENT_CANVAS_MODIFIED = 'canvasModified';

  Easel.prototype.EVENT_OBJECT_ADDED = 'objectAdded';

  Easel.prototype.EVENT_OBJECT_SELECTED = 'objectSelected';

  Easel.prototype.EVENT_OBJECT_MOVING = 'objectMoving';

  Easel.prototype.EVENT_SELECTION_CLEARED = 'selectionCleared';

  Easel.prototype.EVENT_TEXT_SELECTION_CHANGED = 'textSelectionChanged';

  Easel.prototype.EVENT_TEXT_EDITING_ENTERED = 'textEditingEntered';

  Easel.prototype.EVENT_TEXT_EDITING_EXITED = 'textEditingExited';

  Easel.prototype.EVENT_TEXT_STYLES_CHANGED = 'textStylesChanged';

  Easel.prototype.EVENT_TEXT_GET_STYLES = 'textGetStyles';

  Easel.prototype.EVENT_OVERCANVAS_POPUP_SHOW = 'overcanvasPopupShow';

  Easel.prototype.EVENT_OVERCANVAS_POPUP_HIDE = 'overcanvasPopupHide';

  Easel.prototype.EVENT_OVERCANVAS_BUTTON_SHOW = 'overcanvasButtonShow';

  Easel.prototype.EVENT_OVERCANVAS_BUTTON_HIDE = 'overcanvasButtonHide';

  Easel.prototype.EVENT_IMAGE_CROP = 'initImageCrop';

  Easel.prototype.EVENT_RESIZER_HIDE = 'resizerHide';

  Easel.prototype.EVENT_RESIZER_SHOW = 'resizerShow';

  Easel.prototype.EVENT_CREATE_TOOLTIP = 'createTooltip';

  Easel.prototype.EVENT_HIDE_TOOLTIPS = 'hideTooltips';

  Easel.prototype.EVENT_DESTROY_TOOLTIPS = 'destroyTooltips';

  /**
   * Remove event listeners by event name and(or) callback
   *
   * @param eventName
   * @param callback
   * @returns {*}
   */
  Easel.prototype.off = function (eventName, callback) {
    return this._eventEmitter.off(eventName, callback);
  };

  /**
   * Add event listener to canvas element events.
   *
   * @param eventName
   * @param callback
   */
  Easel.prototype.on = function (eventName, callback) {
    return this._eventEmitter.on(eventName, callback);
  };

  /**
   * Trigger any canvas event.
   *
   * @param eventName
   * @param [args]
   * @returns {*}
   */
  Easel.prototype.trigger = function (eventName, args) {
    var eventResult,
        needToLogErors = !this.insideEvent;
    try {
      this.insideEvent = true;
      eventResult = this._eventEmitter.trigger(eventName, args);
    } catch(err) {
      if (this.options.debug) {
        var errorName = 'Catched error - ' + eventName;
        console.groupCollapsed(errorName);
        this.log('Event name',eventName);
        this.log('Arguments', args);
        this.error(err);
        console.groupEnd(errorName);
      }
    }
    if (needToLogErors) {
      this.insideEvent = false;
    }
    return eventResult;
  };
})(Easel.Easel);