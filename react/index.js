/**
 * Easel React Component Library
 * 
 * A React wrapper for the Easel drawing canvas library.
 * Provides a declarative React interface for creating drawing canvases.
 * 
 * @module easel-react
 */

import EaselCanvas from './EaselCanvas.jsx';

// Export the main component
export default EaselCanvas;
export { EaselCanvas };

// Export helper functions if needed
export const createEaselInstance = (container, options) => {
  if (typeof window !== 'undefined' && window.Easel) {
    return new window.Easel(container, options);
  }
  console.error('Easel library not loaded');
  return null;
};

export const version = '1.2.0';
