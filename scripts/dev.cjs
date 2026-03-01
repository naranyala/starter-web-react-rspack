#!/usr/bin/env node
/**
 * Dev server starter with port conflict handling
 * Automatically finds an available port if 3000 is in use
 */

const { spawn } = require('child_process');
const net = require('net');

const DEFAULT_PORT = 3000;
const MAX_PORT = 3100;

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => resolve(false));
    server.on('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

async function findAvailablePort(startPort) {
  for (let port = startPort; port <= MAX_PORT; port++) {
    const available = await checkPort(port);
    if (available) return port;
  }
  return null;
}

async function main() {
  const port = await findAvailablePort(DEFAULT_PORT);
  
  if (!port) {
    console.error(`❌ No available port found between ${DEFAULT_PORT} and ${MAX_PORT}`);
    process.exit(1);
  }
  
  if (port !== DEFAULT_PORT) {
    console.log(`⚠️  Port ${DEFAULT_PORT} is in use, using port ${port} instead`);
  } else {
    console.log(`✅ Using port ${port}`);
  }
  
  console.log('🚀 Starting development server...\n');

  const devServer = spawn('npx', ['rspack', 'serve'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: port.toString() },
  });

  devServer.on('error', (err) => {
    console.error('❌ Failed to start dev server:', err);
    process.exit(1);
  });

  devServer.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

main();
