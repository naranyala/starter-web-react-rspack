# Troubleshooting Guide

This document provides solutions for common issues encountered during development and usage.

## Table of Contents

- [Build Issues](#build-issues)
- [Development Server](#development-server)
- [WinBox Windows](#winbox-windows)
- [WebSocket Connection](#websocket-connection)
- [Styling Issues](#styling-issues)
- [TypeScript Errors](#typescript-errors)
- [Performance Issues](#performance-issues)

---

## Build Issues

### Module Not Found

**Error**: `Module not found: Can't resolve './src/main.tsx'`

**Solution**:
1. Verify entry point in `rspack.config.ts`:
   ```typescript
   entry: {
     index: './src/index.tsx',
   },
   ```
2. Check file exists at specified path
3. Clear cache and rebuild:
   ```bash
   bun run clean
   bun run build
   ```

### CSS Import Errors

**Error**: `Module not found: Can't resolve './styles/app'`

**Solution**:
1. Use correct file extension:
   ```typescript
   import './styles/app.css';
   ```
2. Verify file exists
3. Check import path is correct

### TypeScript Compilation Errors

**Error**: `TS2307: Cannot find module`

**Solution**:
1. Run `bun install` to ensure dependencies are installed
2. Check `tsconfig.json` includes the file:
   ```json
   {
     "include": ["src"]
   }
   ```
3. Restart TypeScript server in IDE

---

## Development Server

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**:
1. Kill process on port 3000:
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```
2. Or use the built-in port management (automatic)
3. Or specify different port:
   ```bash
   PORT=3001 bun run dev
   ```

### Server Not Starting

**Error**: Server fails to start without clear error message

**Solution**:
1. Clear node modules and reinstall:
   ```bash
   rm -rf node_modules
   bun install
   ```
2. Check for syntax errors in config files
3. Verify Node.js version (18.12.0+ required)
4. Check for conflicting processes:
   ```bash
   ps aux | grep rspack
   pkill -f rspack
   ```

### Hot Reload Not Working

**Symptoms**: Changes not reflected in browser

**Solution**:
1. Verify HMR is enabled in `rspack.config.ts`:
   ```typescript
   devServer: {
     hot: true,
   },
   ```
2. Clear browser cache
3. Hard refresh: Ctrl+Shift+R (Linux/Windows) or Cmd+Shift+R (Mac)
4. Check browser console for HMR errors

---

## WinBox Windows

### Window Not Appearing

**Symptoms**: Click card but no window appears

**Solution**:
1. Check WinBox is loaded:
   ```typescript
   console.log('WinBox available:', typeof window.WinBox);
   ```
2. Verify WinBox CSS is imported in `src/index.tsx`:
   ```typescript
   import 'winbox/dist/css/winbox.min.css';
   require('winbox/dist/winbox.bundle.min.js');
   ```
3. Check browser console for errors
4. Verify z-index is not conflicting

### Window Behind Sidebar

**Symptoms**: Window appears behind sidebar

**Solution**:
1. Check sidebar z-index in CSS
2. Verify WinBox z-index override:
   ```css
   .winbox {
     z-index: 99999 !important;
   }
   ```
3. Check sidebar z-index is lower:
   ```css
   .sidebar {
     z-index: 100;
   }
   ```

### Window Not Draggable

**Symptoms**: Window appears but cannot be dragged

**Solution**:
1. Check header element exists
2. Verify no CSS conflicts with `.wb-drag`
3. Check parent container overflow settings
4. Ensure window is not in maximized state

### Close Button Not Working

**Symptoms**: Click close but window does not close

**Solution**:
1. Check onclose handler return value:
   ```typescript
   onclose: function() {
     // Return false to prevent default close
     // Return true or nothing to allow close
     return false; // Prevents close
   }
   ```
2. Verify no CSS pointer-events: none
3. Check z-index of close button

---

## WebSocket Connection

### Connection Failed

**Error**: WebSocket connection fails

**Solution**:
1. Verify backend is running
2. Check WebSocket URL is correct:
   ```typescript
   const url = `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}/_webui_ws_connect`;
   ```
3. Check browser console for connection errors
4. Verify CORS settings if connecting to different origin
5. Check firewall settings

### Connection Drops

**Symptoms**: Connection established but drops frequently

**Solution**:
1. Check network stability
2. Verify backend heartbeat/ping settings
3. Check for memory leaks in frontend
4. Monitor browser resources

### Status Not Updating

**Symptoms**: WebSocket status shows disconnected when connected

**Solution**:
1. Check status hook implementation
2. Verify event listeners are registered
3. Check for JavaScript errors blocking updates
4. Refresh page to reinitialize

---

## Styling Issues

### Styles Not Applying

**Symptoms**: CSS changes not visible

**Solution**:
1. Clear browser cache
2. Hard refresh browser
3. Check CSS import order
4. Verify specificity is not overridden
5. Check for !important conflicts

### Dark Mode Not Working

**Symptoms**: Dark mode styles not applying

**Solution**:
1. Verify media query syntax:
   ```css
   @media (prefers-color-scheme: dark) {
     /* dark mode styles */
   }
   ```
2. Check system dark mode is enabled
3. Verify custom properties are defined for dark mode

### Responsive Layout Broken

**Symptoms**: Layout broken on mobile/tablet

**Solution**:
1. Check media query breakpoints
2. Verify viewport meta tag in HTML:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
3. Test on actual device, not just browser dev tools
4. Check flexbox/grid fallbacks

---

## TypeScript Errors

### Implicit Any Type

**Error**: `TS7006: Parameter implicitly has an 'any' type`

**Solution**:
1. Enable strict mode in `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```
2. Add explicit type annotations:
   ```typescript
   const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
     // ...
   };
   ```

### Module Has No Default Export

**Error**: `TS1192: Module has no default export`

**Solution**:
1. Use named import instead:
   ```typescript
   import { Component } from './Component';
   ```
2. Or add default export to module:
   ```typescript
   export default Component;
   ```

### Cannot Find Name React

**Error**: `TS2304: Cannot find name 'React'`

**Solution**:
1. Ensure React is imported:
   ```typescript
   import React from 'react';
   ```
2. Or configure JSX in `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "jsx": "react-jsx"
     }
   }
   ```

---

## Performance Issues

### Slow Initial Load

**Symptoms**: Application takes long to load initially

**Solution**:
1. Enable code splitting:
   ```typescript
   const LazyComponent = React.lazy(() => import('./HeavyComponent'));
   ```
2. Optimize bundle size:
   ```bash
   bun run build
   # Check bundle analyzer output
   ```
3. Enable caching in rspack.config.ts
4. Use production build for testing

### Slow Window Operations

**Symptoms**: Window drag/resize is laggy

**Solution**:
1. Reduce DOM complexity inside windows
2. Use CSS transforms instead of position changes
3. Debounce resize handlers
4. Limit content re-renders

### Memory Leaks

**Symptoms**: Memory usage grows over time

**Solution**:
1. Check for unsubscribed event listeners
2. Verify cleanup in useEffect hooks:
   ```typescript
   useEffect(() => {
     const subscription = subscribe();
     return () => subscription.unsubscribe();
   }, []);
   ```
3. Check for detached DOM references
4. Use browser DevTools Memory profiler

---

## Common Error Messages

### "WinBox is not defined"

```
ReferenceError: WinBox is not defined
```

**Solution**: Ensure WinBox is imported before use:
```typescript
// src/index.tsx
import 'winbox/dist/css/winbox.min.css';
require('winbox/dist/winbox.bundle.min.js');
```

### "Cannot read property of undefined"

```
TypeError: Cannot read property 'length' of undefined
```

**Solution**: Add null checks:
```typescript
// Before
const count = items.length;

// After
const count = items?.length || 0;
```

### "Maximum update depth exceeded"

```
Error: Maximum update depth exceeded
```

**Solution**: Check for infinite render loops:
```typescript
// Bad - causes infinite loop
useEffect(() => {
  setState(state + 1);
});

// Good - add dependency array
useEffect(() => {
  setState(state + 1);
}, [state]);
```

---

## Getting Help

1. Check browser console for errors
2. Review application logs
3. Search existing documentation
4. Check for similar issues in project repository
