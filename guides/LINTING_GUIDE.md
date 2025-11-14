# Linting and Formatting Configuration Guide

This project uses ESLint and Prettier for code quality and consistent formatting, specifically configured for React Router RSC with TailwindCSS + React Aria Components.

## Configuration Files

### ESLint: `eslint.config.js`

- **React and TypeScript支持**: Full React 19+ and TypeScript support
- **RSC-aware Rules**: Optimized for React Server Components patterns
- **Design System Exceptions**: Special rules for `src/components/ds/` components
- **Test File Permissiveness**: More lenient rules for test files

### Prettier: `.prettierrc`

- **Tab Indentation**: Uses tabs (2 width) per project convention
- **Double Quotes**: Enforced for consistency with RSC patterns
- **Semicolons**: Required for clean, predictable code
- **Print Width**: 100 characters for modern displays
- **ES5 Trailing Commas**: For better compatibility

### Editor Configuration: `.editorconfig`

- **Universal Settings**: Works across all editors (VSCode, WebStorm, etc.)
- **Tab Indentation**: Consistent with Prettier
- **Line Endings**: LF for cross-platform compatibility
- **File Types**: Specific settings for TS/JS, JSON, CSS, Markdown

### VSCode Settings: `.vscode/settings.json`

- **Format on Save**: Automatic Prettier formatting
- **ESLint on Save**: Auto-fix linting issues
- **Tab Configuration**: Matches project standards
- **TypeScript Preferences**: Double quotes for RSC compatibility

## Project-Specific Rules

### Design System Components (`src/components/ds/`)

- **Permissive `any` Types**: Allowed for React Aria component props
- **Focus on Accessibility**: Nolint checks that might interfere with a11y
- **Component Consistency**: Enforces uniform styling patterns

### Test Files (`src/__tests__/**/*`, `*.test.*`, `*.spec.*`)

- **Permissive `any` Types**: Mocking often requires flexible types
- **Relaxed Rules**: Focus on test functionality over strict typing
- **No Prefer-const**: More readable test setup code

### General Files

- **No `var`**: Modern JavaScript practices only
- **Prefer const**: Encourages good variable practices
- **React Rules**: Modern React patterns enforced
- **TypeScript**: Strict typing with helpful warnings

## Scripts Usage

```bash
# Check formatting only
npm run format:check

# Fix formatting issues
npm run format

# Run ESLint (shows warnings/errors)
npm run lint

# Fix auto-fixable ESLint issues
npm run lint:fix

# TypeScript type checking
npm run typecheck

# Run all quality checks (formatting, lint, types)
npm run check
```

## Integration with Development Workflow

### Git Hooks (Recommended)

Consider using husky for pre-commit hooks:

```json
// package.json
{
	"husky": {
		"hooks": {
			"pre-commit": "npm run check"
		}
	}
}
```

### IDE Integration

All major IDEs support ESLint and Prettier:

- **VSCode**: Already configured in `.vscode/settings.json`
- **WebStorm**: Enable ESLint and Prettier plugins
- **Vim**: Use `coc-eslint` and `coc-prettier`
- **Emacs**: Use `flycheck` and `prettier.el`

## RSC-Specific Considerations

### Server vs Client Components

- **ESLint**: Understands "use client" and "use server" directives
- **TypeScript**: Configured for modern RSC patterns
- **Import Resolution**: Proper path aliasing with `~/` prefix

### Accessibility Focus

- **React Aria Components**: Design system enforces a11y patterns
- **ESLint Rules**: Checks for missing accessibility attributes
- **Component Structure**: Encourages proper React Aria usage

## Troubleshooting

### Common Issues

**1. ESLint can't find a rule**

```
Key "rules": Key "example-rule": Could not find "example-rule"
```

_Solution_: Check rule name spelling and plugin availability\*

**2. Prettier conflicts with ESLint**

```
[error] "prettier/prettier" and "example" conflict
```

_Solution_: Add `prettier` config last in ESLint array\*

**3. TypeScript errors in tests**

```
error TS2339: Property 'mockResolvedValue' does not exist
```

_Solution_: Mock types need proper typing - use `@ts-ignore` sparingly\*

**4. RSC directive warnings**

```
"use client" directive should be at the top
```

_Solution_: Ensure "use client" or "use server" is the very first line\*

### Performance Tips

- **ESLint Caching**: Configure for faster builds
- **Prettier Caching**: Automatic in recent versions
- **Git Integration**: Use `.eslintcache` for incremental checks

## Customization

### Adding New Rules

Add to `eslint.config.js`:

```javascript
rules: {
  "your-new-rule": "error",
  "another-rule": "warn"
}
```

### Prettier Overrides

Add overrides to `.prettierrc`:

```json
{
	"overrides": [
		{
			"files": "src/components/ds/**/*",
			"options": {
				"printWidth": 120
			}
		}
	]
}
```

### File-Specific Overrides

Use `.eslintignore` for files that need special treatment:

```
# Generated files
src/generated/
# Build outputs
dist/
# Temporary files
*.tmp
```

This configuration ensures consistent, high-quality code that works seamlessly with the React Router RSC architecture and TailwindCSS + React Aria Components design system.
