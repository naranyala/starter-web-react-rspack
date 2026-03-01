# Styling Guide

This document describes the CSS architecture, conventions, and theming system used in the application.

## Table of Contents

- [CSS Architecture](#css-architecture)
- [Custom Properties](#custom-properties)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Responsive Design](#responsive-design)
- [Dark Mode](#dark-mode)
- [WinBox Styling](#winbox-styling)

## CSS Architecture

The application uses a modular CSS architecture with the following principles:

1. **Reset First**: Base styles reset browser defaults
2. **Theme Layer**: Custom properties define design tokens
3. **Component Styles**: Scoped component styling
4. **Utility Classes**: Reusable utility classes

### File Import Order

```css
/* src/styles/index.css */
@import './reset.css';      /* Browser reset */
@import './theme.css';      /* Design tokens */
@import './app.css';        /* Application styles */
```

---

## Custom Properties

### Color Palette

```css
:root {
  /* Primary Colors */
  --color-primary: #6366f1;
  --color-primary-light: #818cf8;
  --color-primary-dark: #4f46e5;
  
  /* Secondary Colors */
  --color-secondary: #ec4899;
  --color-secondary-light: #f472b6;
  --color-secondary-dark: #db2777;
  
  /* Gray Scale */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;
}
```

### Typography

```css
:root {
  /* Font Families */
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### Spacing

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;      /* 4px */
  --space-2: 0.5rem;       /* 8px */
  --space-3: 0.75rem;      /* 12px */
  --space-4: 1rem;         /* 16px */
  --space-5: 1.25rem;      /* 20px */
  --space-6: 1.5rem;       /* 24px */
  --space-8: 2rem;         /* 32px */
  --space-10: 2.5rem;      /* 40px */
  --space-12: 3rem;        /* 48px */
  --space-16: 4rem;        /* 64px */
}
```

### Shadows

```css
:root {
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-default: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}
```

### Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;   /* 2px */
  --radius-default: 0.25rem; /* 4px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-2xl: 1rem;      /* 16px */
  --radius-3xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;
}
```

### Transitions

```css
:root {
  --transition-fast: 150ms;
  --transition-default: 200ms;
  --transition-slow: 300ms;
  
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Z-Index Scale

```css
:root {
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
  --z-toast: 1080;
}
```

---

## File Organization

```
src/styles/
├── reset.css           # CSS reset styles
├── theme.css           # Custom properties (design tokens)
├── index.css           # Main stylesheet (imports others)
├── app.css             # Application-specific styles
├── cards.css           # Feature card styles
├── status-bar.css      # Status bar component styles
└── error-panel.css     # Error panel component styles
```

---

## Naming Conventions

### CSS Classes

Use kebab-case for class names:

```css
/* Good */
.feature-card { }
.window-item { }
.sidebar-header { }

/* Bad */
.featureCard { }
windowItem { }
```

### Custom Properties

Use descriptive names with category prefix:

```css
/* Good */
--color-primary
--font-sans
--space-4
--shadow-lg

/* Bad */
--mainColor
--font1
--spacing
```

### Component Classes

Prefix component-specific classes:

```css
.card { }                    /* Base component */
.card-header { }             /* Sub-element */
.card-title { }              /* Content element */
.card-actions { }            /* Action area */
.card--featured { }          /* Modifier */
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
@media (min-width: 640px) {   /* sm */
  /* Small devices */
}

@media (min-width: 768px) {   /* md */
  /* Medium devices */
}

@media (min-width: 1024px) {  /* lg */
  /* Large devices */
}

@media (min-width: 1280px) {  /* xl */
  /* Extra large devices */
}

@media (min-width: 1536px) {  /* 2xl */
  /* 2X large devices */
}
```

### Mobile First Example

```css
/* Base styles (mobile) */
.card {
  padding: var(--space-4);
}

/* Tablet and up */
@media (min-width: 768px) {
  .card {
    padding: var(--space-6);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .card {
    padding: var(--space-8);
  }
}
```

---

## Dark Mode

Dark mode is automatically enabled based on system preference:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: var(--color-gray-900);
    --bg-secondary: var(--color-gray-800);
    --text-primary: var(--color-gray-100);
    --text-secondary: var(--color-gray-300);
  }
}
```

### Manual Dark Mode Toggle

To add manual dark mode toggle:

```css
[data-theme="dark"] {
  --bg-primary: var(--color-gray-900);
  --bg-secondary: var(--color-gray-800);
  --text-primary: var(--color-gray-100);
}
```

```javascript
// Toggle dark mode
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## WinBox Styling

### Window Structure

```html
<div class="winbox">
  <div class="wb-header">
    <div class="wb-control">
      <span class="wb-min"></span>
      <span class="wb-max"></span>
      <span class="wb-close"></span>
    </div>
    <div class="wb-drag">
      <div class="wb-title"></div>
    </div>
  </div>
  <div class="wb-body"></div>
</div>
```

### Custom WinBox Styles

```css
.winbox {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  border-radius: 12px !important;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3) !important;
}

.winbox .wb-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.winbox .wb-title {
  color: #ffffff !important;
  font-weight: 600 !important;
}

.winbox .wb-body {
  background: #ffffff !important;
  color: #1f2937 !important;
}
```

### Focus States

```css
.winbox.focused {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4), 
              0 0 0 1px rgba(99, 102, 241, 0.5) !important;
}

.winbox:not(.focused) {
  opacity: 0.95 !important;
}
```

---

## Utility Classes

### Flexbox

```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap: var(--space-2); }
.gap-4 { gap: var(--space-4); }
```

### Grid

```css
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
```

### Spacing

```css
.p-4 { padding: var(--space-4); }
.m-4 { margin: var(--space-4); }
.mt-4 { margin-top: var(--space-4); }
.mb-4 { margin-bottom: var(--space-4); }
```

---

## Best Practices

1. **Use Custom Properties**: Always use design tokens instead of hardcoded values
2. **Mobile First**: Write base styles for mobile, add media queries for larger screens
3. **Avoid !important**: Use specific selectors instead of !important (except for WinBox overrides)
4. **Consistent Naming**: Follow established naming conventions
5. **Comment Complex Styles**: Add comments for non-obvious styling decisions
6. **Group Related Properties**: Organize CSS properties logically
7. **Use Shorthand**: Use shorthand properties when possible (margin, padding)
8. **Avoid Magic Numbers**: Use custom properties for all values
