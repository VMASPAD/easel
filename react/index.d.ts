// Type definitions for Easel React Component
// TypeScript Version: 4.0+

import { Component, RefObject } from 'react';

export interface EaselToolbarConfig {
  position?: 'top' | 'bottom' | 'left' | 'right';
  positionType?: 'inside' | 'outside';
  compactType?: boolean;
}

export interface EaselToolbarsConfig {
  drawingTools?: EaselToolbarConfig;
  toolOptions?: EaselToolbarConfig;
  settings?: EaselToolbarConfig;
  [key: string]: EaselToolbarConfig | undefined;
}

export interface EaselCanvasProps {
  // Canvas dimensions
  width?: number;
  height?: number;

  // Canvas options
  backgroundColor?: string;
  transparentBackground?: boolean;

  // Toolbar options
  toolbars?: EaselToolbarsConfig;
  plugins?: string[];
  defaultActivePlugin?: string | null;

  // Toolbar size
  toolbarSize?: number;
  toolbarSizeTouch?: number;

  // Feature flags
  fullscreenMode?: boolean;
  selectMode?: boolean;

  // Event handlers
  onChange?: (event: any) => void;
  onSave?: (event: any) => void;
  onObjectAdded?: (event: any) => void;
  onObjectModified?: (event: any) => void;
  onObjectRemoved?: (event: any) => void;
  onSelectionCreated?: (event: any) => void;
  onSelectionCleared?: (event: any) => void;

  // Custom options
  [key: string]: any;
}

export interface EaselCanvasRef {
  getInstance: () => any;
  getImageDataUrl: (format?: 'png' | 'jpeg' | 'webp', quality?: number) => string | null;
  getImageBlob: (callback: (blob: Blob) => void, format?: 'png' | 'jpeg' | 'webp', quality?: number) => void;
  loadImage: (imageData: string) => void;
  clear: () => void;
  setBackgroundColor: (color: string) => void;
  setSize: (width: number, height: number) => void;
  undo: () => void;
  redo: () => void;
  activatePlugin: (pluginName: string) => void;
  getFabricCanvas: () => any;
}

declare const EaselCanvas: React.ForwardRefExoticComponent<
  EaselCanvasProps & React.RefAttributes<EaselCanvasRef>
>;

export default EaselCanvas;

export function createEaselInstance(container: HTMLElement, options: any): any;
export const version: string;
