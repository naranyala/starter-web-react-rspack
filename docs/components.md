# Component Documentation

This document provides detailed information about the React components used in the application.

## Table of Contents

- [Main Components](#main-components)
- [Layout Components](#layout-components)
- [Feature Components](#feature-components)
- [Utility Components](#utility-components)

## Main Components

### App

The root application component that orchestrates all other components.

**Location**: `src/App.tsx`

**Props**: None

**State**:
- `activeWindows`: Array of active window information
- `wsStatus`: WebSocket connection status

**Dependencies**:
- Header component
- Sidebar component
- MainContent component
- BottomPanel component

**Usage**:
```tsx
import App from './App';
// Rendered in src/index.tsx
```

---

## Layout Components

### Header

Application header component displaying the main navigation and title.

**Location**: `src/components/Header.tsx`

**Props**: None

**Features**:
- Application title display
- Navigation controls
- Responsive design

---

### Sidebar

Left sidebar component for window management.

**Location**: `src/components/Sidebar.tsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `activeWindows` | WindowInfo[] | List of active windows |
| `onFocusWindow` | (window: WindowInfo) => void | Callback to focus a window |
| `onCloseWindow` | (window: WindowInfo) => void | Callback to close a window |
| `onCloseAllWindows` | () => void | Callback to close all windows |
| `onHideAllWindows` | () => void | Callback to minimize all windows |

**Features**:
- Window list display
- Window count badge
- Home button
- Close all button
- Minimized window indicators

---

### MainContent

Main content area component containing feature cards.

**Location**: `src/components/MainContent.tsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `onOpenSystemInfo` | () => void | Callback to open system info window |
| `onOpenSQLite` | () => void | Callback to open database window |

**Features**:
- Feature card grid
- Glassmorphism card styling
- Click handlers for window creation

---

### BottomPanel

Developer tools and status panel.

**Location**: `src/components/BottomPanel.tsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `wsStatus` | WsStatus | WebSocket connection status |

**Tabs**:
- Status - Quick overview of system metrics
- Metrics - Detailed system metrics
- Events - Event bus activity log
- Errors - Error log
- Console - JavaScript console
- Config - Application configuration
- Debug - Debug tools

**Features**:
- Collapsible panel
- Real-time metrics updates
- Event subscription
- Error logging
- Command execution

---

## Feature Components

### DevToolsPanel

Comprehensive developer tools panel (alternative implementation).

**Location**: `src/components/DevToolsPanel.tsx`

**Props**: None

**Features**:
- System metrics display
- Event bus monitoring
- Error logging
- Console execution
- Configuration display

---

### StatusBar

WebSocket status indicator component.

**Location**: `src/components/StatusBar.tsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `wsStatus` | WsStatus | Current WebSocket status |

**Status Values**:
- `connected` - WebSocket connected
- `connecting` - Attempting to connect
- `disconnected` - Connection lost

---

## Utility Components

### ErrorBoundary

Error boundary component for catching React errors.

**Location**: `src/components/ErrorBoundary.tsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | Child components to wrap |

**Features**:
- Catches JavaScript errors
- Displays error fallback UI
- Logs error information

---

### ErrorProvider

Context provider for error management.

**Location**: `src/utils/ErrorProvider.tsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | Child components |

**Context Values**:
- `addError` - Add new error
- `addErrorFromException` - Add error from exception
- `removeError` - Remove error by ID
- `clearErrors` - Clear all errors
- `errors` - Current error list

---

## Component Communication

### Event Bus

Components communicate through the event bus system.

**Location**: `src/models/event-bus.ts`

**Event Types**:
- `BACKEND_CONNECTED` - Backend connection established
- `BACKEND_DISCONNECTED` - Backend connection lost
- `BACKEND_ERROR` - Backend error occurred
- `DATA_CHANGED` - Data updated

**Usage**:
```typescript
import { EventBus, AppEventType } from '../models/event-bus';

// Subscribe to events
const unsubscribe = EventBus.subscribe(AppEventType.DATA_CHANGED, (event) => {
  console.log('Data changed:', event.payload);
});

// Emit events
EventBus.emit(AppEventType.DATA_CHANGED, { table: 'users' });

// Unsubscribe
unsubscribe();
```

---

## Hooks

### useAppInitialization

Initializes application-wide services and handlers.

**Location**: `src/hooks/useAppInitialization.ts`

**Returns**: void

**Side Effects**:
- Sets up global error handlers
- Initializes logger
- Configures event bus

---

### useWebSocketStatus

Manages WebSocket connection status.

**Location**: `src/hooks/useWebSocketStatus.ts`

**Returns**:
```typescript
{
  wsStatus: WsStatus
}
```

---

### useWindowManager

Manages window state and operations.

**Location**: `src/hooks/useWindowManager.ts`

**Returns**:
```typescript
{
  activeWindows: WindowInfo[],
  setActiveWindows: Dispatch<SetStateAction<WindowInfo[]>>
}
```

---

### useWindowOperations

Provides window operation callbacks.

**Location**: `src/hooks/useWindowOperations.ts`

**Returns**:
```typescript
{
  openWindow: (title: string, content: string, icon: string) => void,
  focusWindow: (windowInfo: WindowInfo) => void,
  closeWindow: (windowInfo: WindowInfo) => void,
  closeAllWindows: () => void,
  hideAllWindows: () => void,
  openSystemInfoWindow: () => void,
  openSQLiteWindow: () => void
}
```

---

## Best Practices

### Component Structure

1. Import statements grouped by type
2. TypeScript interfaces and types
3. Component definition
4. Export statement

### Props Naming

- Use descriptive names
- Prefix event handlers with `on`
- Use boolean prefixes (`is`, `has`, `show`) for flags

### State Management

- Keep state as local as possible
- Lift state only when necessary
- Use context for global state
- Prefer hooks over class components

### Performance

- Use React.memo for pure components
- Memoize callbacks with useCallback
- Memoize values with useMemo
- Lazy load heavy components
