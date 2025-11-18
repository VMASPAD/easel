(function (Easel, util, texts) {
    Easel.prototype.defaultOptions =  {
      captionText: 'Easel',
      defaultWidth : '100%',
      defaultHeight : '500px',

      enableImageCrop: true,

      // TODO: should be fixed or removed
      editOnClick: true,

      exitOnOutsideClick: true,

      // default color for drawing/shapes
      activeColor: '#E80F07',
      activeOpacity: 1,

      // toolbar size in px
      toolbarSize: 35,
      toolbarSizeTouch: 45,

      // toolbars config
      // @todo: move it toolbars files?
      toolbars : {
        popupButtonAlwaysVisible: true,
        disableTooltips: true,
        // drawing tools toolbar config
        drawingTools : {
            position : 'bottom'         // one of [left, right, top, bottom] - changed to bottom for modern centered pill design
        },

        // active tool options toolbar config
        toolOptions : {
          position : 'left',      // move element properties toolbar to the left side
          positionType : 'inside' // keep it attached to the canvas
        },

        // drawer main toolbar config
        settings  : {
          position : 'bottom',      // one of [left, right, top, bottom] - changed to bottom for cohesive pill UI
          render: false             // hide legacy settings toolbar entry
        },
      },

      tooltipCss: {
        background: 'black',
        color: 'white'
      },

      // properties that will be applied to fabricjs canvas on creation
      canvasProperties: {
        selectionColor: 'rgba(255, 255, 255, 0.3)',
        selectionDashArray: [3, 8],
        selectionLineWidth: 1,
        selectionBorderColor: '#5f5f5f'
      },

      // properties that will be applied to every created object
      objectControls: {
        borderColor: '#12dcf7ff',
        borderOpacityWhenMoving: 0.4,
        cornerColor: '#ffffffff',
        cornerStrokeColor: '#12dcf7ff',
        transparentCorners: false,
        cornerSize: 8,
        hasBorders: true
      },

      objectControlsTouch: {
        borderColor: '#12dcf7ff',
        borderOpacityWhenMoving: 0.4,
        cornerColor: '#ffffffff',
        cornerStrokeColor: '#12dcf7ff',
        transparentCorners: false,
        cornerSize: 20,
        hasBorders: true
      },

      contentConfig: {
        saveAfterInactiveSec: null,
        saveInHtml: true,
        canvasDataContainer: null,
        imagesContainer: null,

        loadCanvasData: null,
        saveCanvasData: null,

        loadImageData: null,
        saveImageData: null
      },

      backgroundCss: 'white',
      borderCss: '1px dashed rgb(195, 194, 194)',
      borderCssEditMode: '1px dashed rgb(195, 194, 194)',

      defaultImageUrl: 'images/drawer.jpg',

      plugins: ['ExportSVG'],
      pluginsConfig: {
        ExportSVG: {
          renderToolbarButton: false
        }
      },
      corePlugins: ['Zoom', 'SelectionTool'],

      texts: texts,

      basePath: null,

      debug: false
    };

})(Easel.Easel, Easel.util, Easel.texts);
