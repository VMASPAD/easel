# Easel React Component

A powerful React wrapper for the Easel HTML5 canvas drawing library.

## Installation

```bash
npm install easel
# or
yarn add easel
```

## Quick Start

### Basic Usage

```jsx
import React, { useRef } from 'react';
import { EaselCanvas } from 'easel/react';
import 'easel/dist/easel.min.css';

function App() {
  const easelRef = useRef();

  const handleSave = () => {
    const imageUrl = easelRef.current.getImageDataUrl('png');
    console.log(imageUrl);
  };

  return (
    <div>
      <button onClick={handleSave}>Save Image</button>
      <EaselCanvas
        ref={easelRef}
        width={800}
        height={600}
        backgroundColor="#ffffff"
      />
    </div>
  );
}

export default App;
```

### With Toolbars

```jsx
<EaselCanvas
  ref={easelRef}
  width={900}
  height={600}
  toolbars={{
    drawingTools: {
      position: 'top',
      positionType: 'inside'
    },
    toolOptions: {
      position: 'left',
      positionType: 'inside'
    },
    settings: {
      position: 'right',
      positionType: 'outside'
    }
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `800` | Canvas width in pixels |
| `height` | `number` | `600` | Canvas height in pixels |
| `backgroundColor` | `string` | `'#FFFFFF'` | Canvas background color |
| `transparentBackground` | `boolean` | `false` | Enable transparent background |
| `toolbars` | `object` | `{}` | Toolbar configuration |
| `plugins` | `array` | `[]` | Additional plugins to load |
| `defaultActivePlugin` | `string` | `null` | Plugin to activate on load |
| `toolbarSize` | `number` | `32` | Toolbar button size (desktop) |
| `toolbarSizeTouch` | `number` | `48` | Toolbar button size (touch devices) |
| `fullscreenMode` | `boolean` | `false` | Enable fullscreen mode |
| `selectMode` | `boolean` | `true` | Enable object selection |

### Event Props

| Prop | Type | Description |
|------|------|-------------|
| `onChange` | `function` | Called when canvas changes |
| `onSave` | `function` | Called on save action |
| `onObjectAdded` | `function` | Called when object is added |
| `onObjectModified` | `function` | Called when object is modified |
| `onObjectRemoved` | `function` | Called when object is removed |
| `onSelectionCreated` | `function` | Called when selection is created |
| `onSelectionCleared` | `function` | Called when selection is cleared |

## Ref Methods

Access these methods using a ref:

```jsx
const easelRef = useRef();

// Use methods
easelRef.current.clear();
```

### Available Methods

#### `getImageDataUrl(format, quality)`
Get canvas as data URL.
- `format`: `'png'` | `'jpeg'` | `'webp'` (default: `'png'`)
- `quality`: `0.0` to `1.0` (default: `1.0`)
- Returns: `string` - Data URL

```jsx
const dataUrl = easelRef.current.getImageDataUrl('png', 1.0);
```

#### `getImageBlob(callback, format, quality)`
Get canvas as Blob.
- `callback`: `function(blob)` - Callback with blob
- `format`: Image format (default: `'png'`)
- `quality`: Image quality (default: `1.0`)

```jsx
easelRef.current.getImageBlob((blob) => {
  // Upload blob to server
  const formData = new FormData();
  formData.append('image', blob);
}, 'png', 0.9);
```

#### `loadImage(imageData)`
Load an image onto the canvas.
- `imageData`: `string` - Data URL or image URL

```jsx
easelRef.current.loadImage('data:image/png;base64,...');
```

#### `clear()`
Clear the entire canvas.

```jsx
easelRef.current.clear();
```

#### `setBackgroundColor(color)`
Change the background color.
- `color`: `string` - CSS color value

```jsx
easelRef.current.setBackgroundColor('#ff0000');
```

#### `setSize(width, height)`
Resize the canvas.
- `width`: `number` - New width
- `height`: `number` - New height

```jsx
easelRef.current.setSize(1024, 768);
```

#### `undo()`
Undo the last action.

```jsx
easelRef.current.undo();
```

#### `redo()`
Redo the last undone action.

```jsx
easelRef.current.redo();
```

#### `activatePlugin(pluginName)`
Activate a drawing tool.
- `pluginName`: `string` - Name of plugin ('Pencil', 'Eraser', 'Circle', etc.)

```jsx
easelRef.current.activatePlugin('Pencil');
```

#### `getInstance()`
Get the raw Easel instance for advanced usage.

```jsx
const easelInstance = easelRef.current.getInstance();
```

#### `getFabricCanvas()`
Get the underlying Fabric.js canvas instance.

```jsx
const fabricCanvas = easelRef.current.getFabricCanvas();
```

## Advanced Examples

### Save and Load Images

```jsx
function DrawingApp() {
  const easelRef = useRef();

  const handleSave = () => {
    easelRef.current.getImageBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = url;
      link.click();
    }, 'png');
  };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      easelRef.current.loadImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleLoad} accept="image/*" />
      <button onClick={handleSave}>Save</button>
      <EaselCanvas ref={easelRef} width={800} height={600} />
    </div>
  );
}
```

### Custom Toolbar Actions

```jsx
function CustomControls() {
  const easelRef = useRef();
  const [color, setColor] = useState('#000000');

  const tools = ['Pencil', 'Eraser', 'Circle', 'Rectangle', 'Line', 'Text'];

  const handleColorChange = (newColor) => {
    setColor(newColor);
    // Access Fabric.js canvas to change active object color
    const fabricCanvas = easelRef.current.getFabricCanvas();
    if (fabricCanvas) {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        activeObject.set('stroke', newColor);
        fabricCanvas.renderAll();
      }
    }
  };

  return (
    <div>
      <div>
        {tools.map(tool => (
          <button 
            key={tool}
            onClick={() => easelRef.current.activatePlugin(tool)}
          >
            {tool}
          </button>
        ))}
      </div>
      <input 
        type="color" 
        value={color}
        onChange={(e) => handleColorChange(e.target.value)}
      />
      <button onClick={() => easelRef.current.undo()}>Undo</button>
      <button onClick={() => easelRef.current.redo()}>Redo</button>
      <button onClick={() => easelRef.current.clear()}>Clear</button>
      
      <EaselCanvas
        ref={easelRef}
        width={900}
        height={600}
        toolbars={{
          drawingTools: { position: 'top' }
        }}
        onObjectAdded={(obj) => console.log('Added:', obj)}
        onObjectModified={(obj) => console.log('Modified:', obj)}
      />
    </div>
  );
}
```

### Event Handling

```jsx
function EventExample() {
  const [history, setHistory] = useState([]);

  const logEvent = (eventName, data) => {
    setHistory(prev => [...prev, { eventName, data, time: new Date() }]);
  };

  return (
    <div>
      <EaselCanvas
        width={800}
        height={600}
        onChange={() => logEvent('change')}
        onObjectAdded={(obj) => logEvent('objectAdded', obj)}
        onObjectModified={(obj) => logEvent('objectModified', obj)}
        onObjectRemoved={(obj) => logEvent('objectRemoved', obj)}
        onSelectionCreated={(sel) => logEvent('selectionCreated', sel)}
        onSelectionCleared={() => logEvent('selectionCleared')}
      />
      <div>
        <h3>Event History:</h3>
        {history.map((event, i) => (
          <div key={i}>
            {event.time.toLocaleTimeString()} - {event.eventName}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## TypeScript Support

TypeScript definitions are included. Import types:

```typescript
import { EaselCanvas, EaselCanvasRef } from 'easel/react';
import { useRef } from 'react';

function TypedComponent() {
  const easelRef = useRef<EaselCanvasRef>(null);

  const handleAction = () => {
    easelRef.current?.clear();
  };

  return <EaselCanvas ref={easelRef} width={800} height={600} />;
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

COMMERCIAL - See LICENSE file for details.

## Contributing

This is a commercial product. For support or feature requests, please contact G-TAC Software UG.
