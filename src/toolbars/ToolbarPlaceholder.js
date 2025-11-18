/**
 * Toolbar placeholder.
 *
 * @param {Easel.Easel} drawerInstance
 * @param {string} position
 * @param {string} [positionType]
 * @param {string} [customAnchorSelector]
 *
 * @constructor
 */
var ToolbarPlaceholder = function(drawerInstance, position, positionType, customAnchorSelector) {
  this.drawerInstance = drawerInstance;
  if (!drawerInstance) {
    throw new Error("ToolbarPlaceholder: drawerInstance is not provided!");
  }

  this._setupOptions(position, positionType, customAnchorSelector);


  // Create element
  this._setupElement();
  this._attachEventHandlers();
  this._attachEaselEventHandlers();
};

// positions of placeholder
ToolbarPlaceholder.prototype.TOP_POSITION = 'top';
ToolbarPlaceholder.prototype.BOTTOM_POSITION = 'bottom';
ToolbarPlaceholder.prototype.LEFT_POSITION = 'left';
ToolbarPlaceholder.prototype.RIGHT_POSITION = 'right';
ToolbarPlaceholder.prototype.OVER_CANVAS_POSITION = 'canvas';
ToolbarPlaceholder.prototype.POPUP_POSITION = 'popup';

ToolbarPlaceholder.prototype.POSITION_TYPE_OUTSIDE = 'outside';
ToolbarPlaceholder.prototype.POSITION_TYPE_INSIDE = 'inside';
ToolbarPlaceholder.prototype.POSITION_TYPE_CUSTOM = 'custom';

ToolbarPlaceholder.prototype.CUSTOM_POSITION = 'custom';

// orientations of placeholder
ToolbarPlaceholder.prototype.HORIZONTAL_ORIENTATION = 'horizontal';
ToolbarPlaceholder.prototype.VERTICAL_ORIENTATION = 'vertical';

// States of placeholder
ToolbarPlaceholder.prototype.STATE_HIDDEN = 'hidden';
ToolbarPlaceholder.prototype.STATE_OVERLAY = 'overlay';
ToolbarPlaceholder.prototype.STATE_DISABLED = 'disabled';


// placeholder html
ToolbarPlaceholder.prototype._html_default =  '' +
    '<ul class="noselect toolbar-placeholder" contenteditable=false>' +
      '<li class="toolbar-placeholder-overlay"></li>' +
    '</ul>';

ToolbarPlaceholder.prototype._html_popup =  '' +
    '<div class="noselect toolbar-placeholder hidden" contenteditable=false>' +
      '<div class="close-btn">' +
        '<span class="fa fa-close"></span>' +
      '</div>' +
      '<div class="overlay"></div>' +
    '</div>';

/**@
 * Save and process options
 * @param {String} position one of predefined positions - look at ToolbarPlaceholder.prototype.*_POSITION
 * @param {String} [positionType] one of predefined types - look at ToolbarPlaceholder.prototype.POSITION_TYPE_*
 * @param {String} [customAnchorSelector]
 * @private
 */
ToolbarPlaceholder.prototype._setupOptions = function (position, positionType, customAnchorSelector) {
  if (position === this.POPUP_POSITION) {
    var $popupWrapper = this.drawerInstance.$popupWrapper,
        $popupContent = $popupWrapper && $popupWrapper.find('.popup-content');
    if ($popupContent && $popupContent.length) {
      position = this.CUSTOM_POSITION;
      this.$customAnchor = $popupContent;
    }
  }

  this.position = position;
  this.positionType = positionType;
  this.customAnchorSelector = customAnchorSelector;
};


/**
 * Setup event handlers
 * @private
 */
ToolbarPlaceholder.prototype._attachEventHandlers = function () {

};

/**
 * Setup event handlers for Easel
 * @private
 */
ToolbarPlaceholder.prototype._attachEaselEventHandlers = function () {
  // remove on edit stop
  var self = this;
  this.drawerInstance.on(this.drawerInstance.EVENT_EDIT_STOP, function() {
    self.$element.remove();
  });

  var checkElements = function ($elements) {
    var excludeElements = $elements && $elements.length ? $elements : $(),
        isParent,
        isChild,
        excludeElementsMatched;

    excludeElements.each(function (i, element) {
      var $currEl = $(element);
      if (!excludeElementsMatched) {
        isParent = self.$element.find($currEl).length;
        isChild = self.$element.closest($currEl).length;
        excludeElementsMatched = isParent || isChild;
      }
    });

    return excludeElementsMatched;
  };

  this.drawerInstance.on(this.drawerInstance.EVENT_TOOLBAR_CHANGE_STATE, function(fEvent, data) {
    var dataForChange = $.extend(true, {}, data || {});
    self.changeState(dataForChange);
  });

  this.drawerInstance.on(this.drawerInstance.EVENT_TOOLBAR_CLEAR_STATE, function(fEvent, data) {
    var excludeElements = data && data.excludeElements,
        isParent = self.$element.find(excludeElements).length,
        isChild = self.$element.closest(excludeElements).length,
        customPosition = self.position === self.POSITION_TYPE_CUSTOM,
        excludeElementsMatched = isParent || isChild;
    if (!excludeElementsMatched && !customPosition) {
      self.turnOffOverlay();
      self.turnOffDisabled();
      self._showPlaceholder();
    }
  });

  this.drawerInstance.on(this.drawerInstance.EVENT_TOOLBAR_STATE_HIDDEN_OFF, function(fEvent, data) {
    var dataForChange = $.extend(true, {}, data || {});
    dataForChange.state = 'hidden';
    dataForChange.turnOn = false;
    self.changeState(dataForChange);
  });

  this.drawerInstance.on(this.drawerInstance.EVENT_TOOLBAR_STATE_HIDDEN_ON, function(fEvent, data) {
    var dataForChange = $.extend(true, {}, data || {});
    dataForChange.state = 'hidden';
    dataForChange.turnOn = true;
    self.changeState(dataForChange);
  });

  this.drawerInstance.on(this.drawerInstance.EVENT_TOOLBAR_STATE_OVERLAY_ON, function(fEvent, data) {
    var dataForChange = $.extend(true, {}, data || {});
    dataForChange.state = 'overlay';
    dataForChange.turnOn = true;
    self.changeState(dataForChange);
  });

  this.drawerInstance.on(this.drawerInstance.EVENT_TOOLBAR_STATE_OVERLAY_OFF, function(fEvent, data) {
    var dataForChange = $.extend(true, {}, data || {});
    dataForChange.state = 'overlay';
    dataForChange.turnOn = false;
    self.changeState(dataForChange);
  });

  this.drawerInstance.on(this.drawerInstance.EVENT_TOOLBAR_STATE_DISABLED_ON, function(fEvent, data) {
    var dataForChange = $.extend(true, {}, data || {});
    dataForChange.state = 'disabled';
    dataForChange.turnOn = true;
    self.changeState(dataForChange);
  });

  this.drawerInstance.on(this.drawerInstance.EVENT_TOOLBAR_STATE_DISABLED_OFF, function(fEvent, data) {
    var dataForChange = $.extend(true, {}, data || {});
    dataForChange.state = 'disabled';
    dataForChange.turnOn = false;
    self.changeState(dataForChange);
  });
};

/**
 * Sets placeholder positioning.
 *
 * @param {String} [position] - one of predefined positions - look at ToolbarPlaceholder.prototype.*_POSITION
 * @param {String} [positionType] one of predefined types - look at ToolbarPlaceholder.prototype.POSITION_TYPE_*
 * @param {String} [customAnchorSelector]
 * @private
 */
ToolbarPlaceholder.prototype._setPosition = function(position, positionType, customAnchorSelector) {
  position = position || this.position;
  positionType = positionType || this.positionType;
  customAnchorSelector = customAnchorSelector || this.customAnchorSelector;

  this.position = position;
  if (position == this.CUSTOM_POSITION) {
      this.customAnchorSelector = customAnchorSelector;


      var anchorFromElement = $(window.document).find(this.$customAnchor),
          anchorFromSelector = $(window.document).find(customAnchorSelector),
          $anchor = anchorFromElement.length ? anchorFromElement : (anchorFromSelector.length ? anchorFromSelector : false);
      if ($anchor) {
        // @todo - why this limitation?
        // at the moment - only horizontal position for custom anchors
        this.orientation = this.HORIZONTAL_ORIENTATION;

        // wrap anchor in jQuery
        this.$customAnchor = $anchor;
        this.$customAnchor.append(this.$element);
      } else {
        this.drawerInstance.error("ToolbarPlaceholder : no anchor element found for custom toolbar by selector '" + customAnchorSelector + "'");

        // custom placeholder will be existing top placeholder
        this.position = this.TOP_POSITION;
      }
  } else {

    switch (position) {
      case this.TOP_POSITION :
        this.$element.addClass('toolbar-placeholder-top');
        this.orientation = this.HORIZONTAL_ORIENTATION;
      break;
      case this.BOTTOM_POSITION :
        this.$element.addClass('toolbar-placeholder-bottom');
        this.orientation = this.HORIZONTAL_ORIENTATION;
      break;
      case this.LEFT_POSITION :
        this.$element.addClass('toolbar-placeholder-left');
        this.orientation = this.VERTICAL_ORIENTATION;
      break;
      case this.RIGHT_POSITION :
        this.$element.addClass('toolbar-placeholder-right');
        this.orientation = this.VERTICAL_ORIENTATION;
      break;
      case this.OVER_CANVAS_POSITION :
        this.$element.addClass('toolbar-placeholder-overcanvas');
        this.orientation = this.HORIZONTAL_ORIENTATION;
        break;
      default:
        this.position = this.TOP_POSITION;
        this.$element.addClass('toolbar-placeholder-top');
        this.orientation = this.HORIZONTAL_ORIENTATION;
    }

    if (positionType && positionType === this.POSITION_TYPE_INSIDE) {
      this.$element.addClass('toolbar-placeholder-inside');
    }
    this.$element.attr('data-position', position);

    // add placeholder to container
    var container = this.drawerInstance.$toolbarsWrapper;
    container.append(this.$element);
  }
};

/**@
 * Init placeholder element - create and setup
 * @private
 */
ToolbarPlaceholder.prototype._setupElement = function () {
  var elementHtml = this._getHtmlOfElement();
  this.$element = $(elementHtml);
  this.$overlay = this.$element.find('.toolbar-placeholder-overlay');
  this._setPosition();
};

/**
 * Get html of template
 * @private
 */
ToolbarPlaceholder.prototype._getHtmlOfElement = function () {
  var result;
  result = this._html_default;
  if (this.position === this.POPUP_POSITION) {
    result = this._html_popup;
  }
  return result;
};


/**
 * Toggle state of placeholder
 * @param {Object} data - Configuration object
 * @param {String} data.state - Type of state
 * @param {Boolean} [data.turnOn] - Turn on/off selected state
 * @param {jQuery} [data.excludeElements] - Do not change state of placeholder if it is parent/child at least of one of the next elements
 */
ToolbarPlaceholder.prototype.changeState = function (data) {
  var self = this,
      checkElements;

  checkElements = function ($elements) {
    var excludeElements = $elements && $elements.length ? $elements : $(),
        isParent,
        isChild,
        excludeElementsMatched;

    excludeElements.each(function (i, element) {
      var $currEl = $(element);
      if (!excludeElementsMatched) {
        isParent = self.$element.find($currEl).length;
        isChild = self.$element.closest($currEl).length;
        excludeElementsMatched = isParent || isChild;
      }
    });

    return excludeElementsMatched;
  };

  var excludeElements = data && data.excludeElements.length ? data.excludeElements : $(),
      excludeElementsMatched = checkElements(excludeElements),
      customPosition = self.position === self.POSITION_TYPE_CUSTOM,
      ignore = excludeElementsMatched || customPosition;
  if (!ignore) {
    switch (data.state) {
      case this.STATE_OVERLAY :
        this.toggleOverlay(data.turnOn);
        break;
      case this.STATE_HIDDEN :
        if (data.turnOn) {
          this._hidePlaceholder();
        } else {
          this._showPlaceholder();
        }
        break;
      case this.STATE_DISABLED :
        if (data.turnOn) {
          this.turnOnDisabled();
        } else {
          this.turnOffDisabled();
        }
        break;
    }
  }
};


/**
 * Hide placeholder element
 * @private
 */
ToolbarPlaceholder.prototype._hidePlaceholder = function () {
  this.$element.addClass('hidden');
};

/**
 * Show placeholder element
 * @private
 */
ToolbarPlaceholder.prototype._showPlaceholder = function () {
  this.$element.removeClass('hidden');
};

/**
 * Toggle state of overlay
 * @param {Boolean} [turnOn] - force to turn on overlay state
 */
ToolbarPlaceholder.prototype.toggleOverlay = function (turnOn) {
  if (turnOn) {
    this.turnOnOverlay();
  } else {
    this.turnOffOverlay();
  }
};

/**
 * Turn on "disabled" state
 */
ToolbarPlaceholder.prototype.turnOnDisabled = function () {
  this.$element.addClass('placeholder-disabled');
};

/**
 * Turn off "disabled" state
 */
ToolbarPlaceholder.prototype.turnOffDisabled = function () {
  this.$element.removeClass('placeholder-disabled');
};

/**
 * Turn on "overlay" state
 */
ToolbarPlaceholder.prototype.turnOnOverlay = function () {
  this.$element.addClass('placeholder-overlayed');
};

/**
 * Turn off "overlay" state
 */
ToolbarPlaceholder.prototype.turnOffOverlay = function () {
  this.$element.removeClass('placeholder-overlayed');
};

/**
 * Adds toolbar to placeholder.
 * Shifts placeholder css position to retain its positioning
 *
 * @param {EaselToolbar} toolbar to add
 */
ToolbarPlaceholder.prototype.addToolbar = function(toolbar) {
  var $toolbar = toolbar.$toolbar;
  this.$element.append($toolbar);

  // set toolbar position equal to placeholder position
  toolbar.position = this.position;

  // set toolbar orientation
  var horizontalClass = EaselToolbar.HORIZONTAL_CLASS || 'drawer-toolbar--horizontal';
  var verticalClass = EaselToolbar.VERTICAL_CLASS || 'drawer-toolbar--vertical';
  $toolbar.removeClass(horizontalClass).removeClass(verticalClass);
  if (this.orientation == this.HORIZONTAL_ORIENTATION) {
    $toolbar.addClass(horizontalClass);
  } else {
    $toolbar.addClass(verticalClass);
  }

  // Add dropdown toggle button for right vertical toolbars
  if (this.position === this.RIGHT_POSITION && this.orientation === this.VERTICAL_ORIENTATION) {
    this._addDropdownToggle($toolbar);
  }

};

/**
 * Add dropdown toggle button for vertical toolbars
 * @param {jQuery} $toolbar
 * @private
 */
ToolbarPlaceholder.prototype._addDropdownToggle = function($toolbar) {
  var self = this;
  
  // Create hamburger button if it doesn't exist
  if (!$toolbar.find('.toolbar-dropdown-toggle').length) {
    var $toggleButton = $('<button class="toolbar-dropdown-toggle">' +
      '<i class="fa fa-ellipsis-v"></i>' +
      '</button>');
    
    // Prepend the button before the content wrapper
    $toolbar.prepend($toggleButton);
    
    // Add click handler to toggle dropdown
    $toggleButton.on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $toolbar.toggleClass('dropdown-open');
    });
    
    // Close dropdown when clicking outside
    $(document).on('click.toolbar-dropdown', function(e) {
      var toolbarSelector = '.' + (EaselToolbar.BASE_CLASS || 'drawer-toolbar');
      if (!$(e.target).closest(toolbarSelector).length) {
        $toolbar.removeClass('dropdown-open');
      }
    });
  }
};