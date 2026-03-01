/**
 * Unified Bottom Panel - DevTools & WebSocket Status
 * 
 * Combines WebSocket status monitoring with comprehensive developer tools:
 * - System metrics (backend & frontend)
 * - Event bus activity
 * - WebSocket connection status
 * - Error logs
 * - Database stats
 * - Configuration
 * - Debug tools
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { EventBus, AppEventType } from '../models/event-bus';
import { ErrorLogger, useErrorLogger } from '../services/error-logger';
import type { WsStatus } from '../types';

// Types
interface SystemMetrics {
  timestamp: string;
  uptime_secs: number;
  memory: {
    process_memory_mb: number;
    available_system_mb: number;
  };
  connections: {
    websocket_active: number;
    http_requests_total: number;
  };
  database: {
    tables: { name: string; row_count: number }[];
    total_records: number;
  };
  events: {
    total_emitted: number;
    recent_events: { id: string; name: string; timestamp: string; source: string }[];
  };
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: 'frontend' | 'backend';
  category?: string;
}

interface TabProps {
  id: string;
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

// Tab Button Component (memoized for performance)
const TabButton = React.memo<TabProps>(({ label, icon, active, onClick, badge }) => (
  <button
    type="button"
    className={`devtools-tab ${active ? 'active' : ''}`}
    onClick={onClick}
    role="tab"
    aria-selected={active}
    tabIndex={0}
  >
    <span>{icon}</span>
    {label}
    {badge !== undefined && badge > 0 && (
      <span className="devtools-tab-badge">
        {badge > 99 ? '99+' : badge}
      </span>
    )}
  </button>
));

TabButton.displayName = 'TabButton';

// Unified Bottom Panel Component
export const BottomPanel: React.FC<{ wsStatus: WsStatus }> = ({ wsStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'metrics' | 'events' | 'errors' | 'console' | 'config' | 'debug'>('status');
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<{type: string; content: string}[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Auto-scroll console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleOutput]);

  // Fetch system metrics periodically
  useEffect(() => {
    if (!isOpen && activeTab !== 'status') return;

    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/devtools/metrics');
        if (response.ok) {
          const data = await response.json();
          setSystemMetrics(data);
        }
      } catch (error) {
        // Backend not available, use frontend-only metrics
        setSystemMetrics({
          timestamp: new Date().toISOString(),
          uptime_secs: 0,
          memory: { process_memory_mb: 0, available_system_mb: 0 },
          connections: { websocket_active: 0, http_requests_total: 0 },
          database: { tables: [], total_records: 0 },
          events: { total_emitted: 0, recent_events: [] },
        });
      }
    };

    if (activeTab === 'metrics') {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen, activeTab]);

  // Subscribe to events
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = EventBus.subscribeAll((event) => {
      setEvents(prev => [...prev.slice(-99), {
        id: event.id,
        name: event.name,
        timestamp: new Date(event.timestamp).toISOString(),
        source: event.source,
        payload: event.payload,
      }]);

      // Also add to logs
      addLog({
        id: event.id,
        timestamp: new Date(event.timestamp).toISOString(),
        level: event.source === 'backend' ? 'info' : 'debug',
        message: `${event.name}`,
        source: event.source as 'frontend' | 'backend',
        category: 'event',
      });
    });

    return () => unsubscribe();
  }, [isOpen]);

  // Subscribe to errors
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = EventBus.subscribe(AppEventType.BACKEND_ERROR, (event) => {
      addLog({
        id: `err_${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: 'error',
        message: event.payload.error?.message || 'Unknown error',
        source: 'backend',
        category: 'error',
      });
    });

    return () => unsubscribe();
  }, [isOpen]);

  const addLog = useCallback((log: LogEntry) => {
    setLogs(prev => [...prev.slice(-199), log]);
  }, []);

  const executeConsoleCommand = useCallback((command: string) => {
    const output: {type: string; content: string}[] = [];
    
    try {
      // eslint-disable-next-line no-eval
      const result = eval(command);
      output.push({
        type: 'success',
        content: typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result),
      });
    } catch (error) {
      output.push({
        type: 'error',
        content: error instanceof Error ? error.message : String(error),
      });
    }

    setConsoleOutput(prev => [...prev, { type: 'input', content: `> ${command}` }, ...output]);
  }, []);

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (consoleInput.trim()) {
      executeConsoleCommand(consoleInput.trim());
      setConsoleInput('');
    }
  };

  const formatUptime = (secs: number): string => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${hours}h ${mins}m ${seconds}s`;
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      debug: '#6b7280',
      info: '#3b82f6',
      warning: '#f59e0b',
      error: '#ef4444',
      critical: '#dc2626',
    };
    return colors[level] || '#6b7280';
  };

  const getStatusColor = () => {
    switch (wsStatus) {
      case 'connected': return '#166534';
      case 'connecting': return '#854d0e';
      case 'disconnected': return '#991b1b';
    }
  };

  const getStatusBorder = () => {
    switch (wsStatus) {
      case 'connected': return '#22c55e';
      case 'connecting': return '#eab308';
      case 'disconnected': return '#ef4444';
    }
  };

  const getStatusText = () => {
    switch (wsStatus) {
      case 'connected': return '#86efac';
      case 'connecting': return '#fde047';
      case 'disconnected': return '#fca5a5';
    }
  };

  const getIcon = () => {
    switch (wsStatus) {
      case 'connected': return '●';
      case 'connecting': return '◐';
      case 'disconnected': return '○';
    }
  };

  const errorCount = logs.filter(l => l.level === 'error' || l.level === 'critical').length;

  const getWebSocketInfo = () => ({
    url: `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}/_webui_ws_connect`,
    state: (window as any).WebUI?.getConnectionState()?.state || 'unknown',
    ready: ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][(window as any).WebUI?.getReadyState()] || 'UNINSTANTIATED',
    reconnectAttempts: (window as any).WebUI?.getConnectionState()?.reconnectAttempts || 0,
    lastError: (window as any).WebUI?.getLastError()?.message || 'None',
  });

  const wsInfo = getWebSocketInfo();

  return (
    <div className="devtools-panel">
      {/* Toggle Button - Full Width Bottom Bar */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && activeTab === 'status') setActiveTab('metrics');
        }}
        className="devtools-toggle"
      >
        <span className="devtools-toggle-icon">{isOpen ? '▼' : '▲'}</span>
        <span className="devtools-toggle-text">
          DevTools
        </span>
        <div className="devtools-toggle-info">
          <span className={`devtools-ws-status ws-${wsStatus}`}>
            ● WS: {wsStatus}
          </span>
          <span className="devtools-divider">|</span>
          <span className="devtools-info-item">
            ⏱️ {systemMetrics ? formatUptime(systemMetrics.uptime_secs) : '--:--:--'}
          </span>
          <span className="devtools-divider">|</span>
          <span className="devtools-info-item">
            📦 {systemMetrics?.database.total_records ?? 0} records
          </span>
          <span className="devtools-divider">|</span>
          <span className="devtools-info-item">
            ⚡ {events.length} events
          </span>
        </div>
        {errorCount > 0 && (
          <span className="devtools-error-badge">
            {errorCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="devtools-content">
          {/* Tabs */}
          <div className="devtools-tabs">
            <TabButton
              id="status"
              label="Status"
              icon="📊"
              active={activeTab === 'status'}
              onClick={() => setActiveTab('status')}
            />
            <TabButton
              id="metrics"
              label="Metrics"
              icon="⏱️"
              active={activeTab === 'metrics'}
              onClick={() => setActiveTab('metrics')}
            />
            <TabButton
              id="events"
              label="Events"
              icon="⚡"
              active={activeTab === 'events'}
              onClick={() => setActiveTab('events')}
              badge={events.length}
            />
            <TabButton
              id="errors"
              label="Errors"
              icon="⚠️"
              active={activeTab === 'errors'}
              onClick={() => setActiveTab('errors')}
              badge={errorCount}
            />
            <TabButton
              id="console"
              label="Console"
              icon="💻"
              active={activeTab === 'console'}
              onClick={() => setActiveTab('console')}
            />
            <TabButton
              id="config"
              label="Config"
              icon="⚙️"
              active={activeTab === 'config'}
              onClick={() => setActiveTab('config')}
            />
            <TabButton
              id="debug"
              label="Debug"
              icon="🔧"
              active={activeTab === 'debug'}
              onClick={() => setActiveTab('debug')}
            />
          </div>

          {/* Content */}
          <div className="devtools-body">
            {/* Status Tab - Quick Overview */}
            {activeTab === 'status' && (
              <div>
                <h3 className="devtools-section-title">📊 Quick Overview</h3>
                <div className="devtools-grid">
                  <StatusCard
                    title="⏱️ Uptime"
                    value={systemMetrics ? formatUptime(systemMetrics.uptime_secs) : 'N/A'}
                    color="#3b82f6"
                  />
                  <StatusCard
                    title="💾 Memory"
                    value={systemMetrics ? `${systemMetrics.memory.available_system_mb.toFixed(0)} MB` : 'N/A'}
                    color="#10b981"
                  />
                  <StatusCard
                    title="🔌 WebSocket"
                    value={wsStatus}
                    color={wsStatus === 'connected' ? '#22c55e' : wsStatus === 'connecting' ? '#f59e0b' : '#ef4444'}
                  />
                  <StatusCard
                    title="📦 Database"
                    value={`${systemMetrics?.database.total_records ?? 0} records`}
                    color="#8b5cf6"
                  />
                  <StatusCard
                    title="⚡ Events"
                    value={`${events.length} captured`}
                    color="#f59e0b"
                  />
                  <StatusCard
                    title="📝 Logs"
                    value={`${logs.length} entries (${errorCount} errors)`}
                    color={errorCount > 0 ? '#ef4444' : '#6b7280'}
                  />
                </div>

                {/* WebSocket Details */}
                <h3 className="devtools-section-title">🔌 WebSocket Connection</h3>
                <div className="devtools-config-grid">
                  <ConfigRow label="Status" value={wsStatus} />
                  <ConfigRow label="URL" value={getWebSocketInfo().url} />
                  <ConfigRow label="State" value={getWebSocketInfo().state} />
                  <ConfigRow label="Ready State" value={getWebSocketInfo().ready} />
                  <ConfigRow label="Reconnect Attempts" value={`${getWebSocketInfo().reconnectAttempts}`} />
                  <ConfigRow label="Last Error" value={getWebSocketInfo().lastError} />
                </div>
              </div>
            )}

            {/* Metrics Tab */}
            {activeTab === 'metrics' && (
              <div>
                <h3 className="devtools-section-title">System Metrics</h3>
                <div className="devtools-grid">
                  <MetricCard
                    title="⏱️ Uptime"
                    value={systemMetrics ? formatUptime(systemMetrics.uptime_secs) : 'N/A'}
                  />
                  <MetricCard
                    title="💾 Memory"
                    value={systemMetrics ? `${systemMetrics.memory.available_system_mb.toFixed(0)} MB available` : 'N/A'}
                  />
                  <MetricCard
                    title="🔌 WebSocket"
                    value={`${systemMetrics?.connections.websocket_active ?? 0} active`}
                  />
                  <MetricCard
                    title="📦 Database"
                    value={`${systemMetrics?.database.total_records ?? 0} records`}
                  />
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="devtools-monospace">
                <div className="devtools-meta">
                  {events.length} events captured • Auto-scrolling
                </div>
                {events.slice(-50).reverse().map((event) => (
                  <div
                    key={event.id}
                    style={{
                      padding: '6px',
                      borderBottom: '1px solid #374151',
                      display: 'flex',
                      gap: '10px',
                      fontSize: '11px',
                    }}
                  >
                    <span style={{ color: '#6b7280', minWidth: '100px' }}>
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    <span style={{
                      color: event.source === 'backend' ? '#3b82f6' : '#10b981',
                      fontWeight: 500,
                      minWidth: '70px',
                    }}>
                      [{event.source}]
                    </span>
                    <span style={{ color: '#fbbf24' }}>{event.name}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}

            {/* Errors Tab */}
            {activeTab === 'errors' && (
              <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                <div style={{ marginBottom: '8px', color: '#9ca3af' }}>
                  {errorCount} errors • Last 50 entries
                </div>
                {logs.filter(l => l.level === 'error' || l.level === 'critical').slice(-50).reverse().map((log) => (
                  <div
                    key={log.id}
                    style={{
                      padding: '6px',
                      borderBottom: '1px solid #374151',
                      borderLeft: `3px solid ${getLevelColor(log.level)}`,
                      paddingLeft: '10px',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ color: '#6b7280' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span style={{
                        color: getLevelColor(log.level),
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '10px',
                      }}>
                        {log.level}
                      </span>
                      <span style={{ color: '#9ca3af' }}>[{log.source}]</span>
                    </div>
                    <div style={{ color: '#ef4444', marginBottom: '4px' }}>{log.message}</div>
                    {log.category && (
                      <span style={{
                        background: '#374151',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                      }}>
                        {log.category}
                      </span>
                    )}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}

            {/* Console Tab */}
            {activeTab === 'console' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '350px' }}>
                <div style={{
                  flex: 1,
                  overflow: 'auto',
                  background: '#000',
                  padding: '10px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}>
                  {consoleOutput.map((line, i) => (
                    <div
                      key={i}
                      style={{
                        color: line.type === 'error' ? '#ef4444' : line.type === 'input' ? '#9ca3af' : '#10b981',
                        marginBottom: '4px',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {line.content}
                    </div>
                  ))}
                  <div ref={consoleEndRef} />
                </div>
                <form onSubmit={handleConsoleSubmit} style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    placeholder="Enter JavaScript expression..."
                    style={{
                      flex: 1,
                      background: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      color: '#e5e7eb',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '11px',
                    }}
                  >
                    Run
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsoleOutput([])}
                    style={{
                      background: '#374151',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    Clear
                  </button>
                </form>
              </div>
            )}

            {/* Config Tab */}
            {activeTab === 'config' && (
              <div>
                <h3 style={{ marginBottom: '16px', color: '#fff', fontSize: '14px' }}>Application Configuration</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <ConfigRow label="App Name" value="Rust WebUI Application" />
                  <ConfigRow label="Version" value="1.0.0" />
                  <ConfigRow label="Frontend" value="React 18 + TypeScript" />
                  <ConfigRow label="Backend" value="Rust + WebUI" />
                  <ConfigRow label="Database" value="SQLite" />
                  <ConfigRow label="WebSocket Port" value="9000" />
                  <ConfigRow label="HTTP Port" value="8080" />
                </div>
              </div>
            )}

            {/* Debug Tab */}
            {activeTab === 'debug' && (
              <div>
                <h3 style={{ marginBottom: '16px', color: '#fff', fontSize: '14px' }}>🔧 Debug Tools</h3>
                <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '11px' }}>
                  Test error handling and application boundaries
                </p>

                <div className="devtools-button-group">
                  <button
                    onClick={() => {
                      console.log('Test error triggered!');
                      throw new Error('🧪 Test error: This is a test error from DevTools!');
                    }}
                    className="devtools-btn devtools-btn-error"
                  >
                    🧪 Trigger Error
                  </button>

                  <button
                    onClick={() => {
                      console.warn('Test warning triggered!');
                      throw new Error('⚠️ Test warning: This is a test warning!');
                    }}
                    className="devtools-btn devtools-btn-warning"
                  >
                    ⚠️ Trigger Warning
                  </button>

                  <button
                    onClick={() => {
                      console.log('Test info logged!');
                      alert('ℹ️ Test info: Check console for logs');
                    }}
                    className="devtools-btn devtools-btn-info"
                  >
                    ℹ️ Log Info
                  </button>

                  <button
                    onClick={() => {
                      setLogs([]);
                      setEvents([]);
                      setConsoleOutput([]);
                    }}
                    className="devtools-btn devtools-btn-secondary"
                  >
                    🗑️ Clear All
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Status Card Component (for status tab)
const StatusCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
  <div className="devtools-card">
    <div className="devtools-card-title">{title}</div>
    <div className="devtools-card-value" style={{ color }}>{value}</div>
  </div>
);

// Metric Card Component (for metrics tab)
const MetricCard: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="devtools-card">
    <div className="devtools-card-title">{title}</div>
    <div className="devtools-card-value">{value}</div>
  </div>
);

// Config Row Component
const ConfigRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="devtools-config-row">
    <span className="devtools-config-label">{label}</span>
    <span className="devtools-config-value">{value}</span>
  </div>
);
