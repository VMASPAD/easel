import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import '../dist/easel.standalone.min.js';
import '../dist/easel.min.css';

/**
 * EaselCanvas - React component wrapper for Easel drawing library
 * 
 * @component
 * @example
 * ```jsx
 * import { EaselCanvas } from 'easel';
 * 
 * function App() {
 *   const easelRef = useRef();
 *   
 *   const handleSave = () => {
 *     const imageData = easelRef.current.getImageDataUrl();
 *     console.log(imageData);
 *   };
 *   
 *   return (
 *     <EaselCanvas
 *       ref={easelRef}
 *       width={800}
 *       height={600}
 *       toolbars={{
 *         drawingTools: { position: 'top' }
 *       }}
 *       onSave={handleSave}
 *     />
 *   );
 * }
 * ```
 */
const EaselCanvas = forwardRef((props, ref) => {
  const {
    // Canvas dimensions
    width = 800,
    height = 600,
    
    // Easel configuration options
    toolbars = {},
    plugins = [],
    defaultActivePlugin = null,
    
    // Canvas options
    backgroundColor = '#FFFFFF',
    transparentBackground = false,
    
    // Toolbar options
    toolbarSize = 32,
    toolbarSizeTouch = 48,
    
    // Feature flags
    fullscreenMode = false,
    selectMode = true,
    
    // Event handlers
    onChange = null,
    onSave = null,
    onObjectAdded = null,
    onObjectModified = null,
    onObjectRemoved = null,
    onSelectionCreated = null,
    onSelectionCleared = null,
    
    // Custom options - spread any additional options
    ...customOptions
  } = props;

  const containerRef = useRef(null);
  const easelInstanceRef = useRef(null);

  // Initialize Easel instance
  useEffect(() => {
    if (!containerRef.current || !window.Easel) {
      console.error('Easel library not loaded or container not ready');
      return;
    }

    // Prepare configuration
    const easelConfig = {
      ...customOptions,
      canvasWidth: width,
      canvasHeight: height,
      toolbars,
      plugins,
      defaultActivePlugin,
      backgroundColor,
      transparentBackground,
      toolbarSize,
      toolbarSizeTouch,
      fullscreenMode,
      selectMode,
    };

    // Create Easel instance
    try {
      const easelInstance = new window.Easel(containerRef.current, easelConfig);
      easelInstanceRef.current = easelInstance;

      // Attach event handlers
      if (onChange) {
        easelInstance.on('canvas:changed', onChange);
      }
      if (onSave) {
        easelInstance.on('canvas:save', onSave);
      }
      if (onObjectAdded) {
        easelInstance.on('object:added', onObjectAdded);
      }
      if (onObjectModified) {
        easelInstance.on('object:modified', onObjectModified);
      }
      if (onObjectRemoved) {
        easelInstance.on('object:removed', onObjectRemoved);
      }
      if (onSelectionCreated) {
        easelInstance.on('selection:created', onSelectionCreated);
      }
      if (onSelectionCleared) {
        easelInstance.on('selection:cleared', onSelectionCleared);
      }

    } catch (error) {
      console.error('Failed to initialize Easel:', error);
    }

    // Cleanup on unmount
    return () => {
      if (easelInstanceRef.current) {
        try {
          easelInstanceRef.current.destroy();
        } catch (error) {
          console.error('Error destroying Easel instance:', error);
        }
        easelInstanceRef.current = null;
      }
    };
  }, []); // Empty dependency array - only initialize once

  // Update dimensions if they change
  useEffect(() => {
    if (easelInstanceRef.current && easelInstanceRef.current.api) {
      try {
        easelInstanceRef.current.api.setSize(width, height);
      } catch (error) {
        console.error('Error updating Easel size:', error);
      }
    }
  }, [width, height]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    // Get the raw Easel instance
    getInstance: () => easelInstanceRef.current,
    
    // Common API methods
    getImageDataUrl: (format = 'png', quality = 1.0) => {
      if (!easelInstanceRef.current || !easelInstanceRef.current.api) {
        return null;
      }
      return easelInstanceRef.current.api.getImageDataUrl(format, quality);
    },
    
    getImageBlob: (callback, format = 'png', quality = 1.0) => {
      if (!easelInstanceRef.current || !easelInstanceRef.current.api) {
        return;
      }
      easelInstanceRef.current.api.getImageBlob(callback, format, quality);
    },
    
    loadImage: (imageData) => {
      if (!easelInstanceRef.current || !easelInstanceRef.current.api) {
        return;
      }
      easelInstanceRef.current.api.loadImage(imageData);
    },
    
    clear: () => {
      if (!easelInstanceRef.current || !easelInstanceRef.current.api) {
        return;
      }
      easelInstanceRef.current.api.clearCanvas();
    },
    
    setBackgroundColor: (color) => {
      if (!easelInstanceRef.current || !easelInstanceRef.current.api) {
        return;
      }
      easelInstanceRef.current.api.setBackgroundColor(color);
    },
    
    setSize: (w, h) => {
      if (!easelInstanceRef.current || !easelInstanceRef.current.api) {
        return;
      }
      easelInstanceRef.current.api.setSize(w, h);
    },
    
    undo: () => {
      if (!easelInstanceRef.current) {
        return;
      }
      easelInstanceRef.current.undo();
    },
    
    redo: () => {
      if (!easelInstanceRef.current) {
        return;
      }
      easelInstanceRef.current.redo();
    },
    
    activatePlugin: (pluginName) => {
      if (!easelInstanceRef.current) {
        return;
      }
      easelInstanceRef.current.trigger('canvas:tool:activated', pluginName);
    },
    
    // Fabric.js canvas access
    getFabricCanvas: () => {
      if (!easelInstanceRef.current || !easelInstanceRef.current.fCanvas) {
        return null;
      }
      return easelInstanceRef.current.fCanvas;
    },
  }));

  return (
    <div 
      ref={containerRef}
      className="easel-react-wrapper"
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }}
    />
  );
});

EaselCanvas.displayName = 'EaselCanvas';

export default EaselCanvas;
