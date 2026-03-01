# WinBox.js Integration

This document describes the WinBox.js window management system integration.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Configuration](#configuration)
- [Window Creation](#window-creation)
- [Window Methods](#window-methods)
- [Window Events](#window-events)
- [Styling](#styling)
- [Best Practices](#best-practices)

## Overview

WinBox.js is a modern HTML5 window manager that provides draggable, resizable, minimizable, and maximizable windows within the browser.

### Features

- Draggable windows
- Resizable windows
- Minimize/Maximize functionality
- Window focus management
- Custom content support
- Modal window support
- Touch device support

---

## Installation

WinBox is installed as a dependency and imported in the application entry point:

```typescript
// src/index.tsx
import 'winbox/dist/css/winbox.min.css';
require('winbox/dist/winbox.bundle.min.js');
```

### Package Version

```json
{
  "dependencies": {
    "winbox": "^0.2.82"
  }
}
```

---

## Configuration

### Global Window Settings

Default window configuration is defined in `src/hooks/useWindowOperations.ts`:

```typescript
const winboxInstance = new window.WinBox({
  title: `${icon} ${title}`,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  border: 6,
  width: Math.min(900, Math.max(600, availableWidth * 0.8)),
  height: Math.min(650, Math.max(400, availableHeight * 0.8)),
  x: sidebarWidth + 20,
  y: 40,
  minwidth: 400,
  minheight: 300,
  max: true,
  min: false,
  mount: document.createElement('div'),
});
```

### Option Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | '' | Window title text |
| `background` | string | '#fff' | Header background color |
| `border` | number | 2 | Border width in pixels |
| `width` | number/string | '50%' | Window width |
| `height` | number/string | '50%' | Window height |
| `x` | number/string | 'center' | Horizontal position |
| `y` | number/string | 'center' | Vertical position |
| `minwidth` | number | 150 | Minimum width |
| `minheight` | number | header | Minimum height |
| `maxwidth` | number | parent | Maximum width |
| `maxheight` | number | parent | Maximum height |
| `max` | boolean | false | Start maximized |
| `min` | boolean | false | Start minimized |
| `hidden` | boolean | false | Start hidden |
| `modal` | boolean | false | Modal window |
| `mount` | HTMLElement | body | Mount element |

---

## Window Creation

### Basic Window

```typescript
const window = new window.WinBox({
  title: 'My Window',
  width: 800,
  height: 600,
});
```

### Window with Content

```typescript
const window = new window.WinBox({
  title: 'Content Window',
  width: '80%',
  height: '80%',
  mount: document.createElement('div'),
  oncreate: function() {
    this.body.innerHTML = '<div>Hello World</div>';
  }
});
```

### Window with Custom HTML

```typescript
const window = new window.WinBox({
  title: 'Custom Window',
  background: '#6366f1',
  oncreate: function() {
    this.body.innerHTML = `
      <div style="padding: 20px;">
        <h2>Window Content</h2>
        <p>Custom HTML content</p>
      </div>
    `;
  }
});
```

### Application Implementation

```typescript
// src/hooks/useWindowOperations.ts
const openWindow = useCallback((title: string, content: string, icon: string) => {
  if (!window.WinBox) {
    Logger.error('WinBox is not loaded');
    return;
  }

  const windowId = 'win-' + Date.now();
  const sidebarWidth = 200;
  const availableWidth = window.innerWidth - sidebarWidth;
  const availableHeight = window.innerHeight - 40;

  const winboxInstance = new window.WinBox({
    title: `${icon} ${title}`,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 6,
    width: Math.min(900, Math.max(600, availableWidth * 0.8)),
    height: Math.min(650, Math.max(400, availableHeight * 0.8)),
    x: sidebarWidth + 20,
    y: 40,
    minwidth: 400,
    minheight: 300,
    max: true,
    min: false,
    mount: document.createElement('div'),
    oncreate: function() {
      this.body.style.background = '#ffffff';
      this.body.style.color = '#1f2937';
      this.body.innerHTML = content;
      this.body.style.height = '100%';
      this.body.style.overflow = 'auto';
      this.focus();
    },
    onfocus: function() {
      this.addClass('focused');
    },
    onblur: function() {
      this.removeClass('focused');
    },
    onclose: function() {
      windowManager.removeWindow(windowId);
      setActiveWindows([...windowManager.getAllWindows()]);
      return false;
    },
  });

  windowManager.registerWindow(windowId, title, winboxInstance);
  setActiveWindows([...windowManager.getAllWindows()]);
}, [setActiveWindows]);
```

---

## Window Methods

### Focus

```typescript
window.focus();
```

Brings window to front and sets focus.

### Blur

```typescript
window.blur();
```

Removes focus from window.

### Minimize

```typescript
window.minimize();
```

Minimizes window to taskbar.

### Maximize

```typescript
window.maximize();
```

Maximizes window to fill available area.

### Restore

```typescript
window.restore();
```

Restores window from minimized or maximized state.

### Resize

```typescript
window.resize(width, height, skipAnimation);
```

Resizes window to specified dimensions.

### Move

```typescript
window.move(x, y, skipAnimation);
```

Moves window to specified position.

### Close

```typescript
window.close();
```

Closes and removes window.

### Set Title

```typescript
window.setTitle('New Title');
```

Updates window title.

### Set Background

```typescript
window.setBackground('#ff0000');
```

Updates header background color.

### Add Class

```typescript
window.addClass('custom-class');
```

Adds CSS class to window.

### Remove Class

```typescript
window.removeClass('custom-class');
```

Removes CSS class from window.

### Toggle Class

```typescript
window.toggleClass('custom-class');
```

Toggles CSS class on window.

---

## Window Events

### oncreate

Called when window is created.

```typescript
oncreate: function() {
  console.log('Window created');
}
```

### onclose

Called when window is about to close. Return false to prevent closing.

```typescript
onclose: function() {
  console.log('Window closing');
  return false; // Prevent close
}
```

### onfocus

Called when window receives focus.

```typescript
onfocus: function() {
  console.log('Window focused');
}
```

### onblur

Called when window loses focus.

```typescript
onblur: function() {
  console.log('Window blurred');
}
```

### onmaximize

Called when window is maximized.

```typescript
onmaximize: function() {
  console.log('Window maximized');
}
```

### onunmaximize

Called when window is restored from maximized.

```typescript
onunmaximize: function() {
  console.log('Window unmaximized');
}
```

### onminimize

Called when window is minimized.

```typescript
onminimize: function() {
  console.log('Window minimized');
}
```

### onrestore

Called when window is restored from minimized.

```typescript
onrestore: function() {
  console.log('Window restored');
}
```

### onresize

Called when window is resized.

```typescript
onresize: function(width, height) {
  console.log('Window resized:', width, height);
}
```

### onmove

Called when window is moved.

```typescript
onmove: function(x, y) {
  console.log('Window moved:', x, y);
}
```

### onfullscreen

Called when window enters/exits fullscreen.

```typescript
onfullscreen: function(isFullscreen) {
  console.log('Fullscreen:', isFullscreen);
}
```

---

## Styling

### CSS Structure

```html
<div class="winbox">
  <div class="wb-header">
    <div class="wb-control">
      <span class="wb-min"></span>
      <span class="wb-max"></span>
      <span class="wb-full"></span>
      <span class="wb-close"></span>
    </div>
    <div class="wb-drag">
      <div class="wb-icon"></div>
      <div class="wb-title"></div>
    </div>
  </div>
  <div class="wb-body"></div>
  <div class="wb-n"></div>
  <div class="wb-s"></div>
  <div class="wb-w"></div>
  <div class="wb-e"></div>
  <div class="wb-nw"></div>
  <div class="wb-ne"></div>
  <div class="wb-se"></div>
  <div class="wb-sw"></div>
</div>
```

### Custom Styles

```css
/* Base window */
.winbox {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  border-radius: 12px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3) !important;
}

/* Header */
.winbox .wb-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
  height: 42px !important;
}

/* Title */
.winbox .wb-title {
  color: #ffffff !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
}

/* Control buttons */
.winbox .wb-control span {
  color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.2s ease !important;
}

.winbox .wb-control span:hover {
  color: #ffffff !important;
  background: rgba(255, 255, 255, 0.15) !important;
}

/* Close button hover */
.winbox .wb-close:hover {
  background: #ef4444 !important;
  color: #ffffff !important;
}

/* Body content */
.winbox .wb-body {
  background: #ffffff !important;
  color: #1f2937 !important;
}

/* Focused state */
.winbox.focused {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4), 
              0 0 0 1px rgba(99, 102, 241, 0.5) !important;
}

/* Unfocused state */
.winbox:not(.focused) {
  opacity: 0.95 !important;
  box-shadow: 0 15px 30px -12px rgba(0, 0, 0, 0.2) !important;
}

.winbox:not(.focused) .wb-header {
  background: linear-gradient(135deg, #475569 0%, #334155 100%) !important;
}
```

---

## Best Practices

### Window Management

1. **Track Window References**: Store window references for later manipulation
2. **Clean Up on Close**: Remove references when windows are closed
3. **Handle Focus States**: Update UI based on window focus
4. **Prevent Memory Leaks**: Remove event listeners on close

### Content Loading

1. **Use oncreate**: Populate content in oncreate callback
2. **Set Body Styles**: Configure body background and overflow
3. **Handle Dynamic Content**: Update content as needed

### Performance

1. **Limit Open Windows**: Too many windows impact performance
2. **Lazy Load Content**: Load heavy content on demand
3. **Clean Up Resources**: Remove event listeners and references

### User Experience

1. **Consistent Positioning**: Open windows in predictable locations
2. **Appropriate Sizing**: Size windows appropriately for content
3. **Clear Titles**: Use descriptive window titles
4. **Visual Feedback**: Provide focus/blur visual distinction

### Error Handling

```typescript
const openWindow = useCallback((title: string, content: string) => {
  if (!window.WinBox) {
    Logger.error('WinBox is not loaded');
    return;
  }

  try {
    // Create window
  } catch (error) {
    Logger.error('Failed to create window', { error, title });
  }
}, []);
```

---

## Troubleshooting

### Window Not Appearing

1. Check WinBox is loaded: `console.log(typeof window.WinBox)`
2. Verify mount element exists
3. Check z-index conflicts

### Content Not Displaying

1. Set body background color
2. Check content HTML validity
3. Verify overflow settings

### Positioning Issues

1. Check parent container dimensions
2. Verify x/y coordinates
3. Consider sidebar offset

### Event Not Firing

1. Verify event name spelling
2. Check return value for onclose
3. Ensure proper binding with `this`
