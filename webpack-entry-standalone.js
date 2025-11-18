// Webpack entry point for standalone build
// Import all files in the correct order to preserve global scope

// Libraries - execute in global scope
import 'script-loader!./lib/fabric.1.7.1.js';

// Core - execute in global scope
import 'script-loader!./src/Globals.js';
import 'script-loader!./src/Localization_en.js';
import 'script-loader!./src/Canvas.js';
import 'script-loader!./src/Util.js';
import 'script-loader!./src/Easel.Api.js';
import 'script-loader!./src/Easel.ObjectApi.js';
import 'script-loader!./src/Easel.js';
import 'script-loader!./src/Easel.DefaultOptions.js';
import 'script-loader!./src/Easel.Events.js';
import 'script-loader!./src/Easel.Storage.js';
import 'script-loader!./src/Easel.SimpleFactory.js';

// Fabric extensions - execute in global scope
import 'script-loader!./src/fabricjs_extensions/ErasableMixin.js';
import 'script-loader!./src/fabricjs_extensions/ErasableObject.js';
import 'script-loader!./src/fabricjs_extensions/SegmentablePolygon.js';
import 'script-loader!./src/fabricjs_extensions/PText.js';
import 'script-loader!./src/fabricjs_extensions/ErasableText.js';
import 'script-loader!./src/fabricjs_extensions/Arrow.js';
import 'script-loader!./src/fabricjs_extensions/Clipping.js';
import 'script-loader!./src/fabricjs_extensions/ErasableArrow.js';
import 'script-loader!./src/fabricjs_extensions/ErasableImage.js';
import 'script-loader!./src/fabricjs_extensions/ErasableLine.js';
import 'script-loader!./src/fabricjs_extensions/ErasablePath.js';
import 'script-loader!./src/fabricjs_extensions/ErasablePencilBrush.js';
import 'script-loader!./src/fabricjs_extensions/ErasableRect.js';
import 'script-loader!./src/fabricjs_extensions/FloatingControl.js';
import 'script-loader!./src/fabricjs_extensions/Line.js';
import 'script-loader!./src/fabricjs_extensions/PCircle.js';
import 'script-loader!./src/fabricjs_extensions/PRect.js';
import 'script-loader!./src/fabricjs_extensions/PDiamond.js';
import 'script-loader!./src/fabricjs_extensions/PTriangle.js';

// Toolbars - execute in global scope
import 'script-loader!./src/toolbars/EaselToolbar.js';
import 'script-loader!./src/toolbars/EaselToolbarManager.js';
import 'script-loader!./src/toolbars/ToolbarPlaceholder.js';
import 'script-loader!./src/toolbars/ui-plugins/ToolbarComboBox.js';
import 'script-loader!./src/toolbars/ui-plugins/ToolbarTooltip.js';
import 'script-loader!./src/toolbars/ui-plugins/ToolbarTooltipManager.js';

// Toolbar instances - execute in global scope
import 'script-loader!./src/toolbars/instances/ToolOptionsToolbar.js';
import 'script-loader!./src/toolbars/instances/DrawingToolsToolbar.js';
import 'script-loader!./src/toolbars/instances/SettingsToolbar.js';
import 'script-loader!./src/toolbars/instances/OverCanvasToolbar.js';
import 'script-loader!./src/toolbars/instances/CropImageToolbar.js';
import 'script-loader!./src/toolbars/instances/MinimizedToolbar.js';

// Base plugins - execute in global scope
import 'script-loader!./src/plugins/BaseTool.js';
import 'script-loader!./src/plugins/BaseBrush.js';
import 'script-loader!./src/plugins/BaseShape.js';
import 'script-loader!./src/plugins/BaseOptionTool.js';
import 'script-loader!./src/plugins/BaseTextOptionTool.js';

// Plugins - Brushes - execute in global scope
import 'script-loader!./src/plugins/brush-pencil/Pencil.js';
import 'script-loader!./src/plugins/brush-eraser/EraserPath.js';
import 'script-loader!./src/plugins/brush-eraser/EraserBrush.js';
import 'script-loader!./src/plugins/brush-eraser/Eraser.js';
import 'script-loader!./src/plugins/brush-eraser-simplewhite/SimpleWhiteEraser.js';

// Plugins - Shapes - execute in global scope
import 'script-loader!./src/plugins/shape-arrow/ArrowShape.js';
import 'script-loader!./src/plugins/shape-arrow/ArrowTwoSideShape.js';
import 'script-loader!./src/plugins/shape-circle/Circle.js';
import 'script-loader!./src/plugins/shape-image/ImageShape.js';
import 'script-loader!./src/plugins/shape-image/ImageToolApi.js';
import 'script-loader!./src/plugins/shape-line/Line.js';
import 'script-loader!./src/plugins/shape-polygon/Polygon.js';
import 'script-loader!./src/plugins/shape-rectangle/Rectangle.js';
import 'script-loader!./src/plugins/shape-text/Text.js';
import 'script-loader!./src/plugins/shape-diamond/Diamond.js';

// Plugins - Options - execute in global scope
import 'script-loader!./src/plugins/option-brushSize/BrushSize.js';
import 'script-loader!./src/plugins/option-color/ColorpickerControl.js';
import 'script-loader!./src/plugins/option-color/OpacityControl.js';
import 'script-loader!./src/plugins/option-color/Color.js';
import 'script-loader!./src/plugins/option-colorpicker-html5/ColorpickerHtml5.js';
import 'script-loader!./src/plugins/option-line-width/LineWidth.js';
import 'script-loader!./src/plugins/option-opacity/Opacity.js';
import 'script-loader!./src/plugins/option-stroke-width/StrokeWidth.js';
import 'script-loader!./src/plugins/option-text-styles/TextLineHeight.js';
import 'script-loader!./src/plugins/option-text-styles/TextAlign.js';
import 'script-loader!./src/plugins/option-text-styles/TextFontFamily.js';
import 'script-loader!./src/plugins/option-text-styles/TextFontSize.js';
import 'script-loader!./src/plugins/option-text-styles/TextFontWeight.js';
import 'script-loader!./src/plugins/option-text-styles/TextFontStyle.js';
import 'script-loader!./src/plugins/option-text-styles/TextDecoration.js';
import 'script-loader!./src/plugins/option-text-styles/TextColor.js';
import 'script-loader!./src/plugins/option-text-styles/TextBackgoundColor.js';
import 'script-loader!./src/plugins/options-shape-border/ShapeBorder.js';
import 'script-loader!./src/plugins/options-shape-fill/ShapeFill.js';

// Plugins - Features - execute in global scope
import 'script-loader!./src/plugins/api-set-inactive-drawer-image/ApiSetInactiveEaselImage.js';
import 'script-loader!./src/plugins/feature-canvas-properties/CanvasProperties.js';
import 'script-loader!./src/plugins/feature-export-svg/ExportSVG.js';
import 'script-loader!./src/plugins/feature-fullscreen/Fullscreen.js';
import 'script-loader!./src/plugins/feature-fullscreen/FullscreenModeButton.js';
import 'script-loader!./src/plugins/feature-image-crop/ImageCropPlugin.js';
import 'script-loader!./src/plugins/feature-image-crop/ImageCrop.js';
import 'script-loader!./src/plugins/feature-movable-floating-mode/MovableFloatingMode.js';
import 'script-loader!./src/plugins/feature-overcanvas-popup/OvercanvasPopup.js';
import 'script-loader!./src/plugins/feature-overcanvas-popup/OpenPopupButton.js';
import 'script-loader!./src/plugins/feature-shape-contextmenu/ContextMenu.Api.js';
import 'script-loader!./src/plugins/feature-shape-contextmenu/ShapeContextMenu.js';
import 'script-loader!./src/plugins/feature-toggle-visiblity-button/ToggleVisibilityButton.js';
import 'script-loader!./src/plugins/feature-selection/SelectionTool.js';
import 'script-loader!./src/plugins/feature-zoom/ZoomViewport.js';
import 'script-loader!./src/plugins/feature-zoom/Zoom.js';
