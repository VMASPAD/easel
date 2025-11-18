/**
 * Toolbar with tool options
 *
 * @param {Easel.Easel} drawerInstance
 * @param {Object} [options]
 * @extends EaselToolbar
 * @constructor
 */
var ToolOptionsToolbar = function (drawerInstance, options) {
  // css class for toolbar
  options.toolbarClass = 'tool-options-toolbar';
  // call EaselToolbar c-tor
  EaselToolbar.call(this, drawerInstance, options);
  this.$toolbar.addClass('element-properties-toolbar hidden');
  this._visibilityReasons = {
    manual: false,
    selection: false,
    pencil: false
  };
  this._bindSelectionVisibility();
  // cry loud of birth
  drawerInstance.trigger(drawerInstance.EVENT_OPTIONS_TOOLBAR_CREATED, [this]);
};

ToolOptionsToolbar.prototype = Object.create(EaselToolbar.prototype);
ToolOptionsToolbar.prototype.constructor = EaselToolbar;

ToolOptionsToolbar.prototype._bindSelectionVisibility = function () {
  this._onObjectSelected = function () {
    this._setVisibilityReason('selection', true);
  }.bind(this);
  this._onSelectionCleared = function () {
    this._setVisibilityReason('selection', false);
  }.bind(this);

  this._onToolActivated = function (event, tool) {
    if (tool && tool.name === 'Pencil') {
      this._setVisibilityReason('pencil', true);
    }
  }.bind(this);

  this._onToolDeactivated = function (event, tool) {
    if (tool && tool.name === 'Pencil') {
      this._setVisibilityReason('pencil', false);
    }
  }.bind(this);

  this.drawerInstance.on(this.drawerInstance.EVENT_OBJECT_SELECTED, this._onObjectSelected);
  this.drawerInstance.on(this.drawerInstance.EVENT_SELECTION_CLEARED, this._onSelectionCleared);
  this.drawerInstance.on(this.drawerInstance.EVENT_TOOL_ACTIVATED, this._onToolActivated);
  this.drawerInstance.on(this.drawerInstance.EVENT_TOOL_DEACTIVATED, this._onToolDeactivated);
};

ToolOptionsToolbar.prototype._unbindSelectionVisibility = function () {
  if (this._onObjectSelected) {
    this.drawerInstance.off(this.drawerInstance.EVENT_OBJECT_SELECTED, this._onObjectSelected);
    this._onObjectSelected = null;
  }
  if (this._onSelectionCleared) {
    this.drawerInstance.off(this.drawerInstance.EVENT_SELECTION_CLEARED, this._onSelectionCleared);
    this._onSelectionCleared = null;
  }
  if (this._onToolActivated) {
    this.drawerInstance.off(this.drawerInstance.EVENT_TOOL_ACTIVATED, this._onToolActivated);
    this._onToolActivated = null;
  }
  if (this._onToolDeactivated) {
    this.drawerInstance.off(this.drawerInstance.EVENT_TOOL_DEACTIVATED, this._onToolDeactivated);
    this._onToolDeactivated = null;
  }
};

ToolOptionsToolbar.prototype._setVisibilityReason = function (reason, state) {
  if (!this.$toolbar) {
    return;
  }
  this._visibilityReasons = this._visibilityReasons || {};
  this._visibilityReasons[reason] = !!state;
  var shouldShow = false;
  for (var key in this._visibilityReasons) {
    if (Object.prototype.hasOwnProperty.call(this._visibilityReasons, key) && this._visibilityReasons[key]) {
      shouldShow = true;
      break;
    }
  }
  if (shouldShow) {
    this.$toolbar.removeClass('hidden');
  } else {
    this.$toolbar.addClass('hidden');
  }
};

ToolOptionsToolbar.prototype.showToolbar = function () {
  this._setVisibilityReason('manual', true);
};

ToolOptionsToolbar.prototype.hideToolbar = function () {
  this._setVisibilityReason('manual', false);
};

ToolOptionsToolbar.prototype.remove = function () {
  this._unbindSelectionVisibility();
  EaselToolbar.prototype.remove.call(this);
};

ToolOptionsToolbar.prototype.customScrollMode = true;