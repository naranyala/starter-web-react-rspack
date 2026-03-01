# API Reference

This document describes the backend API communication patterns and interfaces.

## Table of Contents

- [Overview](#overview)
- [WebSocket Connection](#websocket-connection)
- [Event Bus](#event-bus)
- [Backend Functions](#backend-functions)
- [Data Models](#data-models)
- [Error Handling](#error-handling)

## Overview

The frontend communicates with the Rust WebUI backend through:

1. **WebSocket Connection**: Real-time bidirectional communication
2. **Event Bus**: Internal event distribution system
3. **Global Functions**: Backend-exposed JavaScript functions

---

## WebSocket Connection

### Connection Status

The WebSocket connection status is managed through the `useWebSocketStatus` hook:

```typescript
type WsStatus = 'connected' | 'connecting' | 'disconnected';

const { wsStatus } = useWebSocketStatus();
```

### Status Values

| Status | Description |
|--------|-------------|
| `connected` | WebSocket is connected to backend |
| `connecting` | Attempting to establish connection |
| `disconnected` | Connection lost or not established |

### Connection Info

```typescript
const getWebSocketInfo = () => ({
  url: `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}/_webui_ws_connect`,
  state: window.WebUI?.getConnectionState()?.state || 'unknown',
  ready: ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][window.WebUI?.getReadyState()] || 'UNINSTANTIATED',
  reconnectAttempts: window.WebUI?.getConnectionState()?.reconnectAttempts || 0,
  lastError: window.WebUI?.getLastError()?.message || 'None',
});
```

---

## Event Bus

### Import

```typescript
import { EventBus, AppEventType } from '../models/event-bus';
```

### Event Types

```typescript
enum AppEventType {
  BACKEND_CONNECTED = 'backend.connected',
  BACKEND_DISCONNECTED = 'backend.disconnected',
  BACKEND_ERROR = 'backend.error',
  BACKEND_READY = 'backend.ready',
  DATA_CHANGED = 'data.changed',
  WINDOW_CREATED = 'window.created',
  WINDOW_CLOSED = 'window.closed',
}
```

### Subscription

```typescript
// Subscribe to specific event
const unsubscribe = EventBus.subscribe(AppEventType.DATA_CHANGED, (event) => {
  console.log('Data changed:', event.payload);
});

// Subscribe to all events
const unsubscribeAll = EventBus.subscribeAll((event) => {
  console.log('Event:', event.name, event.payload);
});

// Unsubscribe
unsubscribe();
```

### Emission

```typescript
// Simple emit
EventBus.emit(AppEventType.DATA_CHANGED);

// Emit with payload
EventBus.emit(AppEventType.DATA_CHANGED, {
  table: 'users',
  action: 'insert',
  count: 1,
});

// Simple emit without payload
EventBus.emitSimple('custom.event', { data: 'value' });
```

### Event Structure

```typescript
interface BusEvent {
  id: string;
  name: string;
  timestamp: number;
  source: 'frontend' | 'backend';
  payload?: any;
}
```

---

## Backend Functions

### Global Function Registration

Backend functions are exposed to the frontend through WebUI:

```typescript
// Available backend functions
interface Window {
  getUsers?: () => void;
  getDbStats?: () => void;
  refreshUsers?: () => void;
  searchUsers?: (term: string) => void;
  webui?: any;
}
```

### Calling Backend Functions

```typescript
// Check function availability
if (window.getUsers) {
  window.getUsers();
}

// With error handling
try {
  if (window.getDbStats) {
    window.getDbStats();
  }
} catch (error) {
  Logger.error('Failed to get database stats', { error });
}
```

### Response Handling

Backend responses are received through event bus:

```typescript
useEffect(() => {
  const handleDbResponse = ((event: CustomEvent) => {
    const response = event.detail;
    if (response.success) {
      setDbUsers(response.data || []);
    } else {
      Logger.error('Failed to load users', { error: response.error });
    }
  }) as EventListener;

  window.addEventListener('db_response', handleDbResponse);
  return () => window.removeEventListener('db_response', handleDbResponse);
}, []);
```

---

## Data Models

### User

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}
```

### Database Stats

```typescript
interface DbStats {
  users: number;
  tables: string[];
}
```

### Window Info

```typescript
interface WindowInfo {
  id: string;
  title: string;
  minimized: boolean;
  maximized?: boolean;
  winboxInstance: any;
}
```

### WebSocket Status

```typescript
type WsStatus = 'connected' | 'connecting' | 'disconnected';

interface WsMetrics {
  messagesSent: number;
  messagesReceived: number;
  errors: number;
  reconnectAttempts: number;
}
```

### Error Entry

```typescript
interface ErrorEntry {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'critical';
  timestamp: Date;
  source: string;
}
```

---

## Error Handling

### Global Error Handler

```typescript
// src/services/utils/global-error-handler.ts
export function initGlobalErrorHandlers() {
  // Uncaught errors
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('[UNCAUGHT ERROR]', error?.message || message);
    return false;
  };

  // Unhandled promise rejections
  window.onunhandledrejection = (event) => {
    console.error('[UNHANDLED PROMISE REJECTION]', event.reason);
  };
}
```

### Error Logger

```typescript
import { ErrorLogger } from '../services/error-logger';

// Log error
ErrorLogger.error('Failed to load data', {
  table: 'users',
  error: new Error('Connection timeout'),
});

// Log warning
ErrorLogger.warn('Slow response detected', {
  duration: 5000,
  endpoint: '/api/users',
});

// Log info
ErrorLogger.info('Data loaded successfully', {
  count: 100,
  table: 'users',
});
```

### Error Boundary

```typescript
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <MainContent />
    </ErrorBoundary>
  );
}
```

### Error Provider

```typescript
import { useError } from './utils/ErrorProvider';

function Component() {
  const { addError, errors, clearErrors } = useError();

  const handleError = () => {
    addError({
      message: 'Operation failed',
      type: 'error',
      source: 'component',
    });
  };

  return (
    <div>
      {errors.map(error => (
        <div key={error.id}>{error.message}</div>
      ))}
      <button onClick={handleError}>Trigger Error</button>
      <button onClick={clearErrors}>Clear Errors</button>
    </div>
  );
}
```

---

## Logger

### Import

```typescript
import { Logger } from './services/utils/logger';
```

### Methods

```typescript
// Info log
Logger.info('User loaded', { count: 100 });

// Warning log
Logger.warn('Slow response', { duration: 5000 });

// Error log
Logger.error('Connection failed', { error });

// Debug log
Logger.debug('State updated', { state });
```

### Output Format

```
[INFO] User loaded { count: 100 }
[WARN] Slow response { duration: 5000 }
[ERROR] Connection failed { error: ... }
[DEBUG] State updated { state: ... }
```

---

## Best Practices

### API Communication

1. **Check Function Availability**: Always check if backend function exists before calling
2. **Handle Errors**: Wrap API calls in try-catch blocks
3. **Log Activity**: Log API calls and responses for debugging
4. **Clean Up Listeners**: Remove event listeners on component unmount

### Event Bus Usage

1. **Use Specific Events**: Subscribe to specific event types when possible
2. **Unsubscribe**: Always unsubscribe to prevent memory leaks
3. **Payload Structure**: Use consistent payload structures
4. **Source Identification**: Include source in event payload

### Error Handling

1. **Global Handlers**: Set up global error handlers early
2. **Error Boundaries**: Wrap components with error boundaries
3. **User Feedback**: Display user-friendly error messages
4. **Error Recovery**: Provide recovery options when possible

### Data Management

1. **Type Safety**: Use TypeScript interfaces for data models
2. **Validation**: Validate data before use
3. **Default Values**: Provide default values for optional fields
4. **Null Checks**: Check for null/undefined before accessing properties
