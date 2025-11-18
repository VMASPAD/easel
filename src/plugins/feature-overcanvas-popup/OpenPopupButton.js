(function ($, pluginsNamespace) {
  "use strict";

  /**
   * Provides a responsive navbar button to open the over-canvas popup
   *
   * @param {Easel.Easel} drawer
   * @param {Object} options
   * Instance of {@link Easel.Easel}.
   *
   * @constructor
   * @memberof Easel.plugins
   */
  var OpenPopupButton = function OpenPopupButtonConstructor(drawer, options) {
    this.drawer = drawer;
    this.name = 'OpenPopupButton';
    this._setupOptions(options);
    this._bindedToolbarHandler = this._onToolbarCreated.bind(this);
    drawer.on(drawer.EVENT_TOOLS_TOOLBAR_CREATED, this._bindedToolbarHandler);
  };

  OpenPopupButton.prototype._defaultOptions = {
    buttonOrder: 950
  };

  OpenPopupButton.prototype._setupOptions = function (options, pluginName, doNotSave) {
    pluginName = pluginName || this.name;
    var drawer = this.drawerInstance || this.drawer,
        optionsFromEasel = drawer && drawer.getPluginConfig(pluginName),
        result = $.extend(true,
            {},
            this._defaultOptions || {},
            optionsFromEasel || {},
            options || {}
        );

    if (!doNotSave) {
      this.options = result;
    }
    return result;
  };

  OpenPopupButton.prototype._onToolbarCreated = function (ev, toolbar) {
    this.toolbar = toolbar;
    this.createControls(toolbar);
  };

  OpenPopupButton.prototype.createControls = function (toolbar) {
    if (!toolbar) {
      return;
    }

    if (this.$button && this.$button.length) {
      toolbar.removeButton(this.$button);
    }

    var tooltip = this.drawer.t('Open options tools');
    var $button = toolbar.addButton({
      buttonOrder: this.options.buttonOrder,
      additionalClass: 'btn-popup-canvas',
      iconClass: 'fa-sliders',
      tooltipText: tooltip,
      clickHandler: function (event) {
        event.preventDefault();
        this.drawer.trigger(this.drawer.EVENT_OVERCANVAS_POPUP_SHOW, [$button]);
      }.bind(this)
    });

    var $link = $button.find('a');
    $link.attr('aria-label', tooltip);

    this.$button = $button;
  };

  pluginsNamespace.OpenPopupButton = OpenPopupButton;
})(jQuery, Easel.plugins);