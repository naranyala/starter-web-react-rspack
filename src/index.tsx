import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initGlobalErrorHandlers } from './services/utils/global-error-handler';

// Import global styles (reset, variables, utilities, app layout)
import './styles/index.css';

// Import WinBox CSS from node_modules
import 'winbox/dist/css/winbox.min.css';

// Import WinBox JS and expose it globally
import WinBox from 'winbox';
window.WinBox = WinBox;

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
