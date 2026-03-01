import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initGlobalErrorHandlers } from './services/utils/global-error-handler';

// Import global styles (reset, variables, utilities, app layout)
import './styles/index.css';

// Import WinBox CSS from node_modules
import 'winbox/dist/css/winbox.min.css';

// WinBox is a UMD module that attaches itself to window object
declare global {
  interface Window {
    WinBox: any;
  }
}

// Load WinBox JS bundle as a side effect (it attaches to window)
// Using the bundled version which properly exposes to window object
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('winbox/dist/winbox.bundle.min.js');

initGlobalErrorHandlers();

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('✅ React app mounted successfully');
  console.log('✅ WinBox available:', typeof window.WinBox);
}
