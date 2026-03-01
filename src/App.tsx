// Main App component - Simplified and modular

import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { BottomPanel } from './components/BottomPanel';
import { useWebSocketStatus, useAppInitialization, useWindowManager } from './hooks/useAppLogic';
import { useWindowOperations } from './hooks/useWindowOperations';
import { Logger } from './services/utils/logger';
import { EventBus, AppEventType } from './models/event-bus';

const App: React.FC = () => {
  // Initialize app
  useAppInitialization();

  // WebSocket status
  const { wsStatus } = useWebSocketStatus();

  // Window management
  const { activeWindows, setActiveWindows } = useWindowManager();
  const {
    openWindow,
    focusWindow,
    closeWindow,
    closeAllWindows,
    hideAllWindows,
    dbUsers,
    setDbUsers,
    updateSQLiteTable,
    openSystemInfoWindow,
    openSQLiteWindow,
  } = useWindowOperations(setActiveWindows);

  // Handle database response
  useEffect(() => {
    const handleDbResponse = ((event: CustomEvent) => {
      const response = event.detail;
      if (response.success) {
        setDbUsers(response.data || []);
        Logger.info('Users loaded from database', { count: response.data?.length || 0 });
        updateSQLiteTable();

        // Emit data changed event
        EventBus.emitSimple('data.changed', {
          table: 'users',
          count: response.data?.length || 0,
          action: 'loaded'
        });
      } else {
        Logger.error('Failed to load users', { error: response.error });
      }
    }) as EventListener;

    const handleStatsResponse = ((event: CustomEvent) => {
      const response = event.detail;
      if (response.success) {
        Logger.info('Database stats loaded', response.stats);
      }
    }) as EventListener;

    window.addEventListener('db_response', handleDbResponse);
    window.addEventListener('stats_response', handleStatsResponse);

    return () => {
      window.removeEventListener('db_response', handleDbResponse);
      window.removeEventListener('stats_response', handleStatsResponse);
    };
  }, [setDbUsers, updateSQLiteTable]);

  // Handle window resize
  useEffect(() => {
    const handleWindowResize = () => {
      const sidebarWidth = 200;
      const availableWidth = window.innerWidth - sidebarWidth;
      const availableHeight = window.innerHeight - 40;
      
      setActiveWindows(prev => prev.map(w => {
        if (w.maximized && !w.minimized) {
          w.winboxInstance.resize(availableWidth, availableHeight);
          w.winboxInstance.move(sidebarWidth, 0);
        }
        return w;
      }));
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [setActiveWindows]);

  // Setup global functions
  useEffect(() => {
    (window as any).refreshUsers = () => {
      Logger.info('Refreshing users from database');
      if ((window as any).getUsers) {
        (window as any).getUsers();
      }
    };

    (window as any).searchUsers = () => {
      const searchInput = document.getElementById('db-search') as HTMLInputElement;
      const searchTerm = searchInput?.value.toLowerCase() || '';
      Logger.info('Searching users', { term: searchTerm });

      const tableBody = document.getElementById('users-table-body');
      if (tableBody) {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach((row: any) => {
          const text = row.textContent?.toLowerCase() || '';
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      }
    };
  }, []);

  return (
    <div className="app">
      <Sidebar
          activeWindows={activeWindows}
          onFocusWindow={focusWindow}
          onCloseWindow={closeWindow}
          onCloseAllWindows={closeAllWindows}
          onHideAllWindows={hideAllWindows}
        />

        <div className="main-container">
          <Header />

          <MainContent
            onOpenSystemInfo={openSystemInfoWindow}
            onOpenSQLite={openSQLiteWindow}
          />
        </div>

        <BottomPanel wsStatus={wsStatus} />
      </div>
  );
};

export default App;
