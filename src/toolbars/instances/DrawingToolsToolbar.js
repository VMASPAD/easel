/**
 * Drawing tools toolbar
 *
 * @param {Easel.Easel} drawerInstance
 * @param {Object} [options]
 * @extends EaselToolbar
 * @constructor
 */
var DrawingToolsToolbar = function (drawerInstance, options) {
  options.toolbarClass = 'drawing-tools-toolbar';
  this.eventNameSpace = '.toolbar-drawingTools';

  // call super constructor
  EaselToolbar.call(this, drawerInstance, options);
  this._injectExportButton();
  this._setEaselHandlers();
  drawerInstance.trigger(drawerInstance.EVENT_TOOLS_TOOLBAR_CREATED, [this]);
};

DrawingToolsToolbar.prototype = Object.create(EaselToolbar.prototype);
DrawingToolsToolbar.prototype.constructor = EaselToolbar;

/**
 * Attach drawer events handlers
 * @private
 */
DrawingToolsToolbar.prototype._setEaselHandlers = function() {
  var drawerInstance = this.drawerInstance,
      ns = this.eventNameSpace;
  // @todo - move this to some other place!
  // on activating tool - remember it in lastUsedPluginName
  drawerInstance.off(drawerInstance.EVENT_DO_ACTIVATE_TOOL + ns);
  drawerInstance.on(drawerInstance.EVENT_DO_ACTIVATE_TOOL + ns, function (e, tool) {
    drawerInstance.lastUsedPluginName = tool.name;
  });

  // @todo - move this to some other place!
  // if tool was manually switched off - reset lastUsedPluginName
  drawerInstance.off(drawerInstance.EVENT_DO_DEACTIVATE_TOOL + ns);
  drawerInstance.on(drawerInstance.EVENT_DO_DEACTIVATE_TOOL + ns, function(e, tool) {
    if (drawerInstance.lastUsedPluginName == tool.name) {
      drawerInstance.lastUsedPluginName = null;
    }
  });

  drawerInstance.off(drawerInstance.AFTER_CREATE_TOOLBARS + ns);
  drawerInstance.on(drawerInstance.AFTER_CREATE_TOOLBARS + ns, function() {
    drawerInstance.activateDefaultPlugin();
  });
};

DrawingToolsToolbar.prototype._injectExportButton = function () {
  var drawerInstance = this.drawerInstance;
  if (!drawerInstance) {
    return;
  }

  var pluginConfig = drawerInstance.options && drawerInstance.options.pluginsConfig;
  var exportConfig = pluginConfig && pluginConfig.ExportSVG;
  var pluginHandlesButton = exportConfig && exportConfig.renderToolbarButton === true;

  if (pluginHandlesButton) {
    return;
  }

  var buttonConfig = {
    additionalClass: 'btn-export-svg',
    iconClass: 'fa-download',
    tooltipText: drawerInstance.t('Export as SVG'),
    buttonOrder: 900,
    clickHandler: function (event) {
      event.preventDefault();
      this._triggerExportSvg();
    }.bind(this)
  };

  this.addButton(buttonConfig);
};

DrawingToolsToolbar.prototype._triggerExportSvg = function () {
  var exportPlugin = this._getOrCreateExportPlugin();
  if (exportPlugin && typeof exportPlugin.exportCanvas === 'function') {
    exportPlugin.exportCanvas();
  }
};

DrawingToolsToolbar.prototype._getOrCreateExportPlugin = function () {
  var drawerInstance = this.drawerInstance;
  if (!drawerInstance) {
    return null;
  }

  var plugin = this._findExportPluginInstance();
  if (plugin) {
    return plugin;
  }

  drawerInstance.options = drawerInstance.options || {};
  drawerInstance.options.pluginsConfig = drawerInstance.options.pluginsConfig || {};
  drawerInstance.options.pluginsConfig.ExportSVG = drawerInstance.options.pluginsConfig.ExportSVG || {};
  if (typeof drawerInstance.options.pluginsConfig.ExportSVG.renderToolbarButton === 'undefined') {
    drawerInstance.options.pluginsConfig.ExportSVG.renderToolbarButton = false;
  }

  if (!Array.isArray(drawerInstance.options.corePlugins)) {
    drawerInstance.options.corePlugins = [];
  }
  if (drawerInstance.options.corePlugins.indexOf('ExportSVG') === -1) {
    drawerInstance.options.corePlugins.push('ExportSVG');
  }

  if (typeof drawerInstance.loadPlugin === 'function') {
    drawerInstance.loadPlugin('ExportSVG');
    plugin = this._findExportPluginInstance();
  }

  return plugin;
};

DrawingToolsToolbar.prototype._findExportPluginInstance = function () {
  var drawerInstance = this.drawerInstance;
  if (!drawerInstance || !drawerInstance._pluginsInstances) {
    return null;
  }

  return drawerInstance._pluginsInstances.ExportSVG || null;
};