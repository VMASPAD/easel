/**
 * List of all available options for each mode of each toolbar
 * @typedef {Object} defaultSetOfOptions
 * @memberOf EaselToolbar
 * @property {Boolean} [hidden=false] - Toolbar is hidden (via CSS)
 * @property {String} [position="top"] - Position of the toolbar relative to the Easel - top/right/left/bottom/custom
 * @property {Boolean} [toggleVisibilityButton=false] - Use "Toggle visibility" button. Will be ignored if compact type = 'popup'
 * @property {String} [positionType="outside"] - Position type - inside/outside canvas
 * @property {String} [compactType="multiple"] - Compact type - scrollable/multiple/popup
 * @property {String} [customAnchorSelector] - Anchor selector for custom position
 */

var emptyFunc = function() {};

/**
 * Default configuration object of toolbar
 * @typedef {EaselToolbar.defaultSetOfOptions} defaultToolbarOptions
 * @memberOf EaselToolbar
 * @property {EaselToolbar.defaultSetOfOptions} fullscreenMode - Options for fullscreen mode. Able to use same
 * options as for normal mode. Undefined options will be inherited from normal mode
 */

/**
 * Configuration object of button.
 * @typedef {Object} EaselToolbar.buttonConfig
 * @property {String} [additionalClass] add specified class to button's <li> element.
 * @property {String} [iconClass] add specified class to button's <i> element.
 * @property {String} [tooltipText] Tooltip text that will be shown on mouse over.
 * @property {Number} [buttonOrder=10] Order priority of button. Button with min order value will be first.
 * @property {Boolean} [isSubMenu=false] Button is submenu of other button
 * @property {Function} [clickHandler] function that will be invoked when user clicks on this button.
 * @property {Object} [group]  Group object with group class name and tooltip text
 * @property {String} [group.name]  Group unique id
 * @property {String} [group.tooltip]  A tooltip text that will be shown on mouse over
 */

/**
 * Toolbar with tools like brush/rectangle/text etc.
 * @param {Easel.Easel} drawerInstance - Easel instance
 * @param {EaselToolbar.defaultSetOfOptions} [options] Configuration object
 * @constructor EaselToolbar
 */
var EaselToolbar = function (drawerInstance, options) {
  if (!drawerInstance) {
    throw new Error("EaselToolbar c-tor : drawerInstance is not set!");
  }
  this.drawerInstance = drawerInstance;
  this.buttonsGroups = {};

  this._setupOptions(options);
  this._setupElement();
  this._attachEventHandlers();
  this._attachEaselEventHandlers();
  this._initCompactType();
};

EaselToolbar.BASE_CLASS = 'easel-toolbar';
EaselToolbar.MULTILINE_CLASS = 'easel-toolbar--multiline';
EaselToolbar.HORIZONTAL_CLASS = 'easel-toolbar--horizontal';
EaselToolbar.VERTICAL_CLASS = 'easel-toolbar--vertical';
EaselToolbar.FLOATING_CLASS = 'easel-toolbar--floating';
EaselToolbar.BUTTON_EVENT_NAMESPACE = 'easel-toolbar-button';

EaselToolbar.prototype.MULTILINE = 'multiline';
EaselToolbar.prototype.SCROLLABLE = 'scrollable';
EaselToolbar.prototype.POPUP = 'popup';

EaselToolbar.prototype.POSITION_TYPE_OUTSIDE = 'outside';
EaselToolbar.prototype.POSITION_TYPE_INSIDE = 'inside';

/**
 * Toolbar position - one of [left, top, right, bottom, custom]
 * @type {string}
 */
EaselToolbar.prototype.position = 'top';
// button groups
EaselToolbar.prototype.buttonsGroups = {};
EaselToolbar.prototype.buttons = [];

EaselToolbar.prototype._defaultOptions = {
    compactType : EaselToolbar.prototype.MULTILINE,
    positionType: EaselToolbar.prototype.POSITION_TYPE_OUTSIDE,
    buttonWidth : 32,
    buttonHeight : 35
};

/**
 * Default values of button config
 * @type {EaselToolbar.buttonConfig}
 * @private
 */
EaselToolbar.prototype._defaultButtonConfig = {
  additionalClass: '',
  iconClass: '',
  tooltipText: '',
  buttonOrder: 10,
  isSubMenu: false,
  group: {
    name: '',
    tooltip: ''
  },
  clickHandler: emptyFunc
};

/**
 * Setup options
 * @param {Object} [options] - Configuration object
 * @private
 */
EaselToolbar.prototype._setupOptions = function (options) {
  this.options = $.extend(true, {}, this._defaultOptions || {}, options || {});
};

/**
 * Create/setup toolbar element
 * @private
 */
EaselToolbar.prototype._setupElement = function () {
  var toolbarHtml = this._generateTemplate(),
      $toolbar = $(toolbarHtml);
  this.$toolbar = $toolbar;
  this.$toolbarContentHolder = this.$toolbar.find('.toolbar-content-wrapper');
};

/**
 * Get html of toolbar element
 * @returns {String}
 * @private
 */
EaselToolbar.prototype._generateTemplate = function () {
  var html,
      wrapperClasses = EaselToolbar.BASE_CLASS + ' ' +
          (this.options.toolbarClass || '') +
          (this.options.hidden ? ' hidden ' : '');

  html = '' +
      '<ul class="' + wrapperClasses + '" ' +
        'contenteditable="false"' +
        // 'tabindex="-1"' +
      '>' +
          '<ul class="toolbar-content-wrapper"></ul>' +
      '</ul>';
  return html;
};

/**
 * Setup events
 * @private
 */
EaselToolbar.prototype._attachEventHandlers = function () {

};

/**
 * Setup drawer events
 * @private
 */
EaselToolbar.prototype._attachEaselEventHandlers = function () {
  var self = this;
  // always hide group dropdown when any tool activates
  this.drawerInstance.on(this.drawerInstance.EVENT_DO_ACTIVATE_TOOL, function () {
    // self.$toolbar.find('ul.group-items-container').addClass('hidden');
    // @todo: hide all open sub-menus
    self.hideActiveSubmenu();
  });
};

/**
 * Process "compactType" option
 * @private
 */
EaselToolbar.prototype._initCompactType = function () {
  switch (true) {
    case (this.options.compactType === EaselToolbar.prototype.SCROLLABLE):
      this._initCompactType_scrollable();
      break;
    case (this.options.compactType === EaselToolbar.prototype.MULTILINE):
      this._initCompactType_multiline();
      break;
    case (this.options.compactType === EaselToolbar.prototype.POPUP):
      this._initCompactType_popup();
      break;
    default:
      this._initCompactType_multiline();
      break;
  }
};

/**
 * Init 'scrollable' compact type
 * @private
 */
EaselToolbar.prototype._initCompactType_scrollable = function () {
  this.isScrollable = true;
  this.scrollModeActive = false;
  this.currentScrollOffset = 0;

  this.$toolbar.addClass('toolbar-scrollable');

  // look, if show scroll UI on drawer resize and edit start

  this.drawerInstance.on(this.drawerInstance.EVENT_CANVAS_START_RESIZE, this._onCanvasResizeStart.bind(this));
  this.drawerInstance.on(this.drawerInstance.EVENT_CANVAS_RESIZING, this._onCanvasResizing.bind(this));
  this.drawerInstance.on(this.drawerInstance.EVENT_CANVAS_STOP_RESIZE, this._onCanvasResizeFinish.bind(this));
  this.drawerInstance.on(this.drawerInstance.EVENT_EDIT_START, this.checkScroll.bind(this));

  // handle scrolling by swipe
  this.$toolbar.on('mousedown.toolbar touchstart.toolbar', this.onTouchStart.bind(this));
};

/**
 * Init 'multiline' compact type
 * @private
 */
EaselToolbar.prototype._initCompactType_multiline = function () {
  this.$toolbar.addClass(EaselToolbar.MULTILINE_CLASS);
};

/**
 * Init 'popup' compact type
 * @private
 */
EaselToolbar.prototype._initCompactType_popup = function () {
  this._initCompactType_multiline();
};


/**
 * Removes toolbar element.
 * @fires Easel.Easel.EVENT_TOOLBAR_DESTROYED
 */
EaselToolbar.prototype.remove = function () {
    this.$toolbar.remove();
    this.buttonsGroups = {};
    this.drawerInstance.trigger(this.drawerInstance.EVENT_TOOLBAR_DESTROYED, [this]);
};


/**
 * Adds control to toolbar.
 * @param {jQuery|HTMLElement} control
 * @param buttonOrder
 */
EaselToolbar.prototype.addControl = function (control, buttonOrder) {
  buttonOrder = buttonOrder !== undefined ? buttonOrder : this._defaultButtonConfig.buttonOrder;
  var orderString = this._getOrderString(buttonOrder),
      currStyleAttr = control.attr('style');
  control.attr('style', (currStyleAttr || '') + ';' + orderString);
  this.$toolbarContentHolder.append(control);
};


/**
 * Add a button to this toolbar.
 * @param {EaselToolbar.buttonConfig} options Button configuration object
 */
EaselToolbar.prototype.addButton = function (options) {
  options = this._validateButtonConfig(options);
  var $button = this.createButton(options);

  this.buttons.push($button);

  // add button and create tooltip
  this.$toolbarContentHolder.append($button);

  // toolbar grew bigger, so call check for scroll
  this.checkScroll();

  return $button;
};

/**
 * Add a button to this toolbar. Button will be appended to group.
 * Group is a one button which will show dropdown with its buttons on click.
 *
 * @param {EaselToolbar.buttonConfig} options Button configuration object
 */
EaselToolbar.prototype.addButtonToGroup = function (options) {
  options = this._validateButtonConfig(options);
  var $groupContainer = this.buttonsGroups[options.group.name],
      groupElementIsExist = $groupContainer && $groupContainer.length,
      needToCreateGroup = !groupElementIsExist;

  // create group. if no group exists
  if (needToCreateGroup) {
    this._createAndAppendGroup(options.group, options.iconClass,options.buttonOrder);
    $groupContainer = this.buttonsGroups[options.group.name];
  }

  // create button
  options.isSubMenu = true;
  var $button = this.createButton(options);

  // and append to toolbar
  $groupContainer.$submenuWrapper.buttons.push($button);
  $groupContainer.find('.group-items-container').append($button);

  return $button;
};

/**
 * Check values of button config object
 * @param {EaselToolbar.buttonConfig} options - button configuration
 * @returns {EaselToolbar.buttonConfig}
 */
EaselToolbar.prototype._validateButtonConfig = function (options) {
  options = options || {};
  var defaultConf = $.extend(true, {}, this._defaultButtonConfig),
      result = $.extend(true, {}, defaultConf, options);

  result.buttonOrder = typeof result.buttonOrder === 'number' ? result.buttonOrder : defaultConf.buttonOrder;
  result.isSubMenu = result.isSubMenu !== undefined ? result.isSubMenu : defaultConf.isSubMenu;
  result.clickHandler = typeof result.clickHandler === 'function' ? result.clickHandler : defaultConf.clickHandler;
  return result;
};

EaselToolbar.prototype._getOrderString = function (orderValue) {
  var orderString = '' +
      '-webkit-order:' + orderValue + ';' +
      '-ms-flex-order:' + orderValue + ';' +
      'order:' + orderValue + ';';
  return orderString;
};

/**
 * Creates jQuery object with button element markup.
 *
 * @param {EaselToolbar.buttonConfig} options - button configuration
 * @returns {jQuery}
 */
EaselToolbar.prototype.createButton = function (options) {
  var orderString = this._getOrderString(options.buttonOrder),
      styleString = 'style="' + orderString + '"';
  // button html
  var $button,
      submenuClass = options.isSubMenu ? ' submenu-child ' : ' ',
      classString = 'toolbar-button ' + options.additionalClass + submenuClass,
      buttonHtml = '' +
    '<li ' +
          'class="' + classString + '"' +
          'data-tooltip-class="'+options.additionalClass+'"' +
        styleString +
    '>' +
      '<a href="#" ' +
          'class="toolbar-button-icon ' + submenuClass + '"' +
        'data-editable-canvas-sizeable="toolbar-button" ' +
        'data-editable-canvas-cssrules="line-height,font-size:($v / 2.5)" tabindex="-1"' +
      '>' +
          '<i class="fa ' + options.iconClass + ' ' + submenuClass + '"></i>' +
      '</a>' +
    '</li>';
  $button = $(buttonHtml);

  var tooltipOptions = {
    additionalClass: options.additionalClass,
    text: options.tooltipText,
    position: 'bottom'
  };
  
  // Only create tooltip if not disabled
  if (!this.drawerInstance.options.toolbars.disableTooltips) {
    $button.tooltip = this.drawerInstance.trigger(this.drawerInstance.EVENT_CREATE_TOOLTIP, [$button.find('a'), tooltipOptions]);
  }

  // prevent default behavior on link click
  var $link = $button.find('a');
  $link.on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  // set click handler
  Easel.util.bindClick($link, EaselToolbar.BUTTON_EVENT_NAMESPACE, options.clickHandler);
  return $button;
};


/**
 * Remove button and attached handlers
 * @param {jQuery} $button - Button element
 */
EaselToolbar.prototype.removeButton = function ($button) {
  if (!$button) {
    console.warn("EaselToolbar.removeButton() : no $button is provided!");
    return;
  }
  // unbind click handler
  Easel.util.unbindClick($button.find('a'), EaselToolbar.BUTTON_EVENT_NAMESPACE);
  // remove element
  $button.remove();

};

/**
 * Creates group button with empty list of tools, and appends it to toolbar
 *
 * @param {Object} group - group data object
 * @param {string} group.name - name of group
 * @param {string} iconClass  - css icon class of group button
 * @param {Number} buttonOrder  - button order value
 * @private
 */
EaselToolbar.prototype._createAndAppendGroup = function(group, iconClass, buttonOrder) {
  // group container html
  var orderString = this._getOrderString(buttonOrder),
      styleString = 'style="' + orderString + '"';
  var $groupContainer = $(
      '<li class="toolbar-button btn-group group-' + group.name + '"' +
          'data-editable-canvas-sizeable="toolbar-button" ' +
          'data-editable-canvas-cssrules="width,height"' +
          styleString +
      '>' +
          '<a href="#" ' +
              'class="toolbar-button-icon"'+
              'data-editable-canvas-sizeable="toolbar-button" ' +
              'data-editable-canvas-cssrules="line-height,font-size:($v / 2.5)" ' +
              'tabindex="-1"' +
          '>' +
              '<i class="fa ' + iconClass + '"></i>' +
        '</a>' +
        '<div class="submenu-wrapper">' +
            '<ul class="group-items-container submenu-child toolbar-dropdown-block">' +
            '</ul>' +
        '</div>' +
      '</li>');

  $groupContainer.$submenuWrapper = $groupContainer.find('.submenu-wrapper');
  $groupContainer.$submenuWrapper.buttons = [];

  // add group container to toolbar
  this.$toolbarContentHolder.append($groupContainer);
  this.buttonsGroups[group.name] = $groupContainer;

  // prevent default action on link click - moving to anchor
  $groupContainer.find('a').on('click',  function(e) {
      e.preventDefault();
  });
  // react on click
  $groupContainer.on('click', this.onGroupButtonClick.bind(this, $groupContainer));

  // create tooltip to group

  var tooltipOptions = {
    additionalClass: group.name,
    text: group.tooltip,
    position: 'bottom'
  };
  this.drawerInstance.trigger(this.drawerInstance.EVENT_CREATE_TOOLTIP, [$groupContainer.children('a'), tooltipOptions]);
};

/**
 * Set active button
 * @param {String} buttonClassName
 */
EaselToolbar.prototype.setActiveButton = function (buttonClassName) {
  var $button = this.$toolbar.find('.toolbar-button.' + buttonClassName),
      $buttonIcon = $button.find('.toolbar-button-icon');
  $buttonIcon.addClass('active');
};

/**
 * Remove active state for all buttons
 */
EaselToolbar.prototype.clearActiveButton = function () {
  var $activeButton = this.$toolbar.find('.toolbar-button .toolbar-button-icon.active');
  $activeButton.removeClass('active');
};


/**
 * React on group button click
 * @param {jQuery} $groupButtton - Group container
 * @param {Event} evt
 * @private
 */
EaselToolbar.prototype.onGroupButtonClick = function($groupButtton, evt) {
  // copy submenu, including handlers
  this.activeSubmenu = $groupButtton.$submenuWrapper.clone(true);
  // var $submenu = $submenuSrc.clone(true);

  var $btn = $(evt.currentTarget);
  var $placeholder = this.$toolbar.parent();

  // append to toolbar before positioning, so this.activeSubmenu has width and height for further calculations
  $placeholder.append(this.activeSubmenu);

  var placeholderRect = $placeholder.get(0).getBoundingClientRect();
  var buttonRect = $btn.get(0).getBoundingClientRect();
  var submenuRect = this.activeSubmenu.get(0).getBoundingClientRect();
  var GAP = 6;
  var left = buttonRect.left - placeholderRect.left;
  var top = buttonRect.top - placeholderRect.top;

  if (this.isHorizontal()) {
    left += (buttonRect.width - submenuRect.width) / 2;
    if (this.position === 'bottom') {
      top -= submenuRect.height + GAP;
    } else {
      top += buttonRect.height + GAP;
    }
  } else {
    top += (buttonRect.height - submenuRect.height) / 2;
    if (this.position === 'right') {
      left -= submenuRect.width + GAP;
    } else {
      left += buttonRect.width + GAP;
    }
  }

  var maxLeft = $placeholder.width() - submenuRect.width;
  var maxTop = $placeholder.height() - submenuRect.height;
  if (!isFinite(maxLeft) || maxLeft < 0) {
    maxLeft = 0;
  }
  if (!isFinite(maxTop) || maxTop < 0) {
    maxTop = 0;
  }

  left = Math.min(Math.max(left, 0), maxLeft);
  top = Math.min(Math.max(top, 0), maxTop);

  this.activeSubmenu.css({
    left: Math.round(left) + 'px',
    top: Math.round(top) + 'px'
  });

  $('body').on('mousedown.submenu', this.onSubmenuMouseDown.bind(this));

};

/**
 * React on submenu click
 * @param {Event} evt
 * @private
 */
EaselToolbar.prototype.onSubmenuMouseDown = function(evt) {
    if (!this.activeSubmenu)
        return;
    if (evt.target == this.activeSubmenu || $(evt.target).hasClass('submenu-child') )
        return;

    this.hideActiveSubmenu();
};

/**
 * Hide active submenu
 */
EaselToolbar.prototype.hideActiveSubmenu = function() {
    if (this.activeSubmenu) {
        // hide all tooltips
        this.drawerInstance.trigger(this.drawerInstance.EVENT_HIDE_TOOLTIPS);

        this.activeSubmenu.remove();
        this.activeSubmenu = null;
        $('body').off('mousedown.submenu');

    }
};

// EaselToolbar.prototype.onGroupButtonClick = function(evt, button) {

// };

/**
 * Makes tool button with css class buttonClass as active.
 * This is achieved by making group button copy of the tool button.
 *
 * @param groupName
 * @param buttonClass
 * @private
 */
EaselToolbar.prototype._setGroupButtonActive = function (groupName, buttonClass) {
  // find group and button
  var $groupContainer = this.buttonsGroups[groupName];
  var $button = this.$toolbar.find('.' + buttonClass);

  // set $groupContainer css class same as $button class
  $groupContainer.attr('class', $button.attr('class'));
  $groupContainer.addClass('btn-group');

  var groupButton = $groupContainer.children('a');
  // make $button.a active
  groupButton.addClass('active');
  // copy $button.a html to $groupContainer.a
  groupButton.html($button.children('a').html());
};


/**
 * React on touch start
 * @param {Event} evt
 * @private
 */
EaselToolbar.prototype.onTouchStart = function(evt) {
    if (!this.scrollModeActive)
        return;

    this.mouseDown = true;

    // handling touch events
    var e = (evt.type == 'touchstart') ?  evt.originalEvent.touches[0] : evt;
    // get coord we are interested in
    var curCoord = this.isHorizontal() ? e.pageX : e.pageY;

    // touch start coord plus existing offset
    this.touchStartCoord = curCoord + this.currentScrollOffset;

    $('body').on('mouseup.toolbar touchend.toolbar', this.onTouchEnd.bind(this));

    this.$toolbar.on('mousemove.toolbar touchmove.toolbar', this.onTouchMove.bind(this));
};

/**
 * React on touch end
 * @param {Event} evt
 * @private
 */
EaselToolbar.prototype.onTouchEnd = function(evt) {
    this.mouseDown = false;
    $('body').off('mousemove.toolbar touchmove.toolbar');
    $('body').off('mouseup.toolbar touchend.toolbar');
};

/**
 * React on touch move
 * @param {Event} evt
 * @private
 */
EaselToolbar.prototype.onTouchMove = function(evt) {
  if (this.mouseDown) {
    var eventTarget = evt.target,
        $eventTarget = $(eventTarget),
        isInput = $eventTarget.is('input'),
        isColorIndicator = $eventTarget.is('.color-indicator'),
        processEvent = !isInput && !isColorIndicator;

    if (processEvent) {
      // prevent default action - copying of toolbar content
      evt.preventDefault();

      // handling touch events
      var e = (evt.type === 'touchmove') ?  evt.originalEvent.touches[0] : evt;

      // get coord we are interested in
      var curCoord = this.isHorizontal() ? e.pageX : e.pageY;

      var delta = this.touchStartCoord - curCoord;

      this.scrollTo(delta);
    }
  }
};

/**
 * React on canvas resize start
 * @private
 */
EaselToolbar.prototype._onCanvasResizeStart = function() {
  this.checkScroll();
};

/**
 * React on canvas resizing
 * @private
 */
EaselToolbar.prototype._onCanvasResizing = function() {
  this.checkScroll();
};

/**
 * React on canvas resize finish
 * @private
 */
EaselToolbar.prototype._onCanvasResizeFinish = function() {
  this.checkScroll();
};

/**
 *  Compares sizes of toolbar and its placeholder,
 *  if toolbar is bigger - shows scroll
 */
EaselToolbar.prototype.checkScroll = function() {
    // Scrolling disabled
    this.scrollModeActive = false;
};


/**
 * Toggle toolbar visibility
 * @param {Boolean} [saveCurrentState]
 * @param {Boolean} [useSaved]
 */
EaselToolbar.prototype.toggleToolbarVisibility = function (saveCurrentState, useSaved) {
  var currentState = !this.$toolbar.hasClass('hidden'),
      showToolbar = useSaved ? this.visibilityState : currentState;

  if (showToolbar) {
    this.showToolbar(saveCurrentState);
  } else {
    this.hideToolbar(saveCurrentState);
  }
};

/**
 * Hide toolbar
 * @param {Boolean} [saveCurrentState]
 */
EaselToolbar.prototype.hideToolbar = function (saveCurrentState) {
  if (saveCurrentState) {
    this.visibilityState = !this.$toolbar.hasClass('hidden');
  }
  this.invisible = true;
  this.$toolbar.addClass('hidden');
};

/**
 * Show toolbar
 * @param {Boolean} [saveCurrentState]
 */
EaselToolbar.prototype.showToolbar = function (saveCurrentState) {
  if (saveCurrentState) {
    this.visibilityState = !this.$toolbar.hasClass('hidden');
  }
  this.invisible = false;
  this.$toolbar.removeClass('hidden');
};


/**
 * Scroll toolbar to the offset.
 * @param  {Number} newOffset
 */
EaselToolbar.prototype.scrollTo = function (newOffset) {
    // Scrolling disabled
};


/**
 * Returns one of [horizontal, vertical]
 * @return {String} toolbar orientation
 */
EaselToolbar.prototype.getToolbarOrientation = function () {
  return this.$toolbar.hasClass(EaselToolbar.VERTICAL_CLASS) ? 'vertical' : 'horizontal';
};


/**
 * @return {Boolean}
 */
EaselToolbar.prototype.isHorizontal = function () {
  return (this.getToolbarOrientation() ===  'horizontal');
};


/**
 * height of toolbar
 * @return {Number}
 */
EaselToolbar.prototype.height = function () {
  return this.$toolbar.height();
};


/**
 * Width of toolbar
 * @return {Number}
 */
EaselToolbar.prototype.width = function () {
  return this.$toolbar.width();
};

Easel.EaselToolbar = EaselToolbar;


