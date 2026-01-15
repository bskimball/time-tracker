# Monorepo Development Guide

This guide covers development workflows for the monorepo containing the React Router RSC web application and Astro marketing site.

## 📁 Monorepo Structure

```
monorepo/
├── apps/
│   ├── web/              # React Router RSC application
│   └── marketing/        # Astro marketing site
├── packages/
│   ├── design-system/    # Shared UI components & styles
│   └── config/           # Shared tooling configurations (planned)
├── package.json          # Root workspace configuration
└── guides/               # Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 22.6+** (required for native TypeScript support)
- **npm** or **pnpm** (pnpm recommended for workspaces)

### Initial Setup

```bash
# Clone and navigate to the monorepo
cd monorepo

# Install all dependencies
npm install

# Start development servers
npm run dev
```

This will start both the web app and marketing site in development mode.

## 🛠️ Development Workflows

### Running Individual Applications

#### Web Application (React Router RSC)

```bash
# Navigate to web app
cd apps/web

# Install dependencies (if not done at root)
npm install

# Start development server
npm run dev
```

- **URL**: http://localhost:5173
- **Features**: Hot reload, full RSC development experience

#### Marketing Site (Astro)

```bash
# Navigate to marketing site
cd apps/marketing

# Install dependencies (if not done at root)
npm install

# Start development server
npm run dev
```

- **URL**: http://localhost:4321
- **Features**: Fast static generation, React components via Astro integration

### Running Both Applications Simultaneously

From the monorepo root:

```bash
# Start all development servers
npm run dev

# Or run specific workspaces
npm run dev --workspace=web
npm run dev --workspace=marketing
```

### Building for Production

```bash
# Build all applications
npm run build

# Build specific applications
npm run build --workspace=web
npm run build --workspace=marketing

# Build design system
npm run build --workspace=design-system
```

## 🎨 Working with the Design System

### Modifying Shared Components

The design system package (`packages/design-system/`) contains shared UI components used by both applications.

#### Development Workflow

```bash
# Navigate to design system
cd packages/design-system

# Install dependencies
npm install

# Start watch mode for development
npm run dev

# Build for production
npm run build
```

#### Adding New Components

1. **Create the component** in `packages/design-system/src/components/`
2. **Export it** in `packages/design-system/src/index.ts`
3. **Update types** in `packages/design-system/src/types/index.ts` if needed
4. **Rebuild** the package: `npm run build`
5. **Test in both apps** to ensure compatibility

#### Component Guidelines

- **React Aria Components**: Use for accessibility (Button, Input, etc.)
- **Framework Agnostic**: Components should work in React and Astro
- **TailwindCSS**: All styling via utility classes
- **TypeScript**: Full type safety required

### Updating Design Tokens

Design tokens are defined in `packages/design-system/src/styles/index.css`:

```css
:root {
	--primary: oklch(0.62 0.18 45); /* Safety Orange */
	--background: oklch(0.97 0.003 264); /* Light Gray */
	/* ... more tokens */
}
```

After updating tokens:

1. Rebuild the design system: `npm run build --workspace=design-system`
2. Restart development servers to pick up changes

## 🔧 Development Commands

### Root Level Commands

```bash
# Install all dependencies
npm install

# Run development servers for all apps
npm run dev

# Build all applications
npm run build

# Run linting across all workspaces
npm run lint

# Run type checking across all workspaces
npm run typecheck

# Full quality check
npm run check
```

### Application-Specific Commands

#### Web App (`apps/web/`)

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Production server

# Quality
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run format       # Prettier

# Database
npm run db:seed      # Seed database
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
```

#### Marketing Site (`apps/marketing/`)

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Quality
npm run astro -- check  # Astro check
```

#### Design System (`packages/design-system/`)

```bash
# Development
npm run dev          # Watch mode
npm run build        # Production build
npm run typecheck    # TypeScript check
```

## 🧪 Testing

### Web Application Testing

```bash
cd apps/web
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Visual test runner
```

### Integration Testing

- Tests are located in `apps/web/src/__tests__/`
- Integration tests verify RSC data flow
- Component tests ensure design system compatibility

## 🚀 Deployment

### Separate Deployments

Each application deploys independently:

#### Web Application

```bash
cd apps/web
npm run build
npm run start  # Production server on port 3000
```

#### Marketing Site

```bash
cd apps/marketing
npm run build  # Static files in dist/
# Deploy dist/ to CDN (Netlify, Vercel, etc.)
```

### Environment Variables

#### Web App (`.env.local`)

```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=...
# ... other secrets
```

#### Marketing Site

- No environment variables needed (static site)
- Configure build settings in deployment platform

## 🔍 Troubleshooting

### Common Issues

#### Design System Changes Not Reflecting

```bash
# Rebuild design system
npm run build --workspace=design-system

# Restart development servers
# Ctrl+C then npm run dev
```

#### Port Conflicts

- Web app: http://localhost:5173
- Marketing: http://localhost:4321
- Change ports in individual `package.json` scripts if needed

#### TypeScript Errors

```bash
# Check types in specific workspace
npm run typecheck --workspace=web
npm run typecheck --workspace=marketing

# Check design system types
npm run typecheck --workspace=design-system
```

#### Dependency Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or use npm ci for clean install
npm ci
```

### Debugging

#### Web App (React Router RSC)

- Check browser Network tab for RSC payloads
- Use React DevTools for component debugging
- Check server logs for RSC rendering errors

#### Marketing Site (Astro)

- Check browser console for hydration errors
- Use Astro dev tools for component inspection
- Verify React components are properly imported

## 📋 Best Practices

### Code Organization

- **Shared logic** → `packages/design-system/`
- **Web app features** → `apps/web/src/`
- **Marketing content** → `apps/marketing/src/`

### Git Workflow

```bash
# Feature branch workflow
git checkout -b feature/new-component
# Make changes...
git commit -m "feat: add new component"
git push origin feature/new-component
```

### Commit Messages

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring

### Code Quality

- Run `npm run check` before committing
- Use Prettier for consistent formatting
- Follow ESLint rules
- Write tests for new features

## 📚 Additional Resources

- [React Router RSC Documentation](https://reactrouter.com/how-to/react-server-components)
- [Astro Documentation](https://docs.astro.build/)
- [React Aria Components](https://react-spectrum.adobe.com/react-aria/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🆘 Getting Help

1. Check this guide first
2. Review existing guides in `guides/` folder
3. Check GitHub issues for known problems
4. Ask in development channels

---

**Last Updated**: December 7, 2025</content>
<parameter name="filePath">guides/MONOREPO_DEVELOPMENT_GUIDE.md
