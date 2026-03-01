# Rust WebUI Application - React Frontend

A modern React-based frontend application bundled with Rspack, designed to work with a Rust WebUI backend. Features a comprehensive window management system powered by WinBox.js.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Build](#build)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Component Documentation](docs/components.md)
- [Styling Guide](docs/styling.md)
- [WinBox Integration](docs/winbox.md)
- [API Reference](docs/api.md)
- [Troubleshooting](docs/troubleshooting.md)

## Overview

This frontend application provides a modern, responsive user interface for interacting with a Rust-based WebUI backend. It features a multi-window interface using WinBox.js, allowing users to open multiple draggable, resizable windows for different functionalities.

## Features

- Modern React 18+ with TypeScript
- High-performance Rspack bundler
- WinBox.js window management system
- Comprehensive error handling and logging
- Event bus architecture for component communication
- WebSocket status monitoring
- Real-time database statistics
- Developer tools panel
- Responsive design with CSS custom properties
- Dark mode support
- Modular component architecture

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Rspack | 1.7.x | Module Bundler |
| WinBox | 0.2.x | Window Manager |
| Bun | 1.x | Package Manager & Runtime |

### Development Tools

| Tool | Purpose |
|------|---------|
| Biome | Linting and Formatting |
| SWC | Fast TypeScript/JavaScript Compiler |
| CSS Modules | Scoped Styling |

## Prerequisites

Ensure the following tools are installed before proceeding:

- **Node.js**: Version 18.12.0 or higher
- **Bun**: Version 1.0.0 or higher
- **Git**: For version control

### Installing Bun

```bash
# Linux/macOS
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd starter-web-react-rspack
```

2. Install dependencies:

```bash
bun install
```

3. Verify installation:

```bash
bun run build
```

## Development

Start the development server:

```bash
bun run dev
```

The application will be available at:

- **Primary**: http://localhost:3000
- **Fallback**: If port 3000 is in use, the next available port (3001, 3002, etc.) will be used automatically

### Development Features

- Hot Module Replacement (HMR)
- Fast refresh for React components
- Source maps for debugging
- Automatic port selection on conflict

## Build

Create a production build:

```bash
bun run build
```

Output will be generated in the `dist/` directory.

### Build Output Structure

```
dist/
├── index.html
└── static/
    ├── css/
    │   └── index.[hash].css
    └── js/
        ├── index.[hash].js
        └── vendors.[hash].js
```

## Project Structure

```
starter-web-react-rspack/
├── src/
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── models/           # Data models and interfaces
│   ├── services/         # Business logic and utilities
│   ├── styles/           # CSS stylesheets
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── index.tsx         # Application entry point
│   └── App.tsx           # Main application component
├── docs/                 # Documentation
├── scripts/              # Build and utility scripts
├── public/               # Static assets (if any)
├── dist/                 # Build output
├── node_modules/         # Dependencies
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── rspack.config.ts      # Rspack bundler configuration
└── biome.json            # Biome linter configuration
```

## Configuration

### Rspack Configuration

The Rspack configuration is defined in `rspack.config.ts`:

- Entry point: `src/index.tsx`
- Output directory: `dist/`
- Development server port: 3000 (auto-adjusts if in use)
- CSS support enabled
- React Fast Refresh enabled in development

### TypeScript Configuration

TypeScript configuration is defined in `tsconfig.json`:

- Target: ES2020
- Module: ESNext
- JSX: react-jsx
- Strict mode enabled

### Biome Configuration

Biome configuration is defined in `biome.json`:

- Indent style: Space
- Indent width: 2
- Line width: 100
- Quote style: Single

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Create production build |
| `bun run preview` | Preview production build |
| `bun run lint` | Run Biome linter |
| `bun run lint:fix` | Fix linting issues |
| `bun run format` | Check formatting |
| `bun run format:fix` | Fix formatting issues |
| `bun run clean` | Clean build artifacts |

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 87+ |
| Edge | 88+ |
| Firefox | 78+ |
| Safari | 14+ |

## Documentation

- [Component Documentation](docs/components.md) - Detailed component reference
- [Styling Guide](docs/styling.md) - CSS architecture and conventions
- [WinBox Integration](docs/winbox.md) - Window management system
- [API Reference](docs/api.md) - Backend communication
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

## License

[Specify your license here]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
