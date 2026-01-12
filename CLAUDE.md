# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
pnpm dev        # Start development server on http://localhost:3000
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm tsc --noEmit  # Check TypeScript errors
```

### Adding UI Components
```bash
npx shadcn@latest add <component>  # Add new shadcn/ui components
```

## Architecture

### Tech Stack
- **Next.js 16.1.1** with App Router and React Server Components
- **NextAuth.js 4.24** for authentication (Google OAuth)
- **next-intl 4.7.0** for internationalization (en, el locales)
- **Tailwind CSS 4** with CSS variables and modern color space
- **shadcn/ui** components (New York style)
- **TypeScript** with strict mode

### Project Structure
- `app/[locale]/` - Dynamic locale-based routing
- `app/api/auth/[...nextauth]/` - NextAuth API routes
- `components/ui/` - shadcn/ui components
- `components/auth/` - Authentication components
- `lib/i18n/` - Internationalization configuration
- `lib/auth/` - NextAuth configuration
- `lib/general/` - General utilities (utils.ts)
- `messages/` - Translation files (en.json, el.json)
- `proxy.ts` - Middleware for i18n routing (not middleware.ts)
- `types/` - Shared TypeScript interfaces

### Key Patterns

#### Internationalization
- All pages/layouts receive `params: Promise<{ locale: string }>`
- Server components: Use `await getTranslations()` with `setRequestLocale(locale)`
- Type-safe translations via `global.d.ts`
- Navigation helpers in `lib/i18n/navigation.ts` (Link, redirect, useRouter)

#### Component Development
- Default to Server Components, use "use client" only when needed
- Always await params in pages/layouts (Next.js 16 requirement)
- Use `@/` path alias for imports
- Utility function `cn()` in `@/lib/general/utils.ts` for merging Tailwind classes

#### Styling
- CSS variables defined in `app/globals.css`
- Dark mode via `next-themes` with class strategy
- Custom Tailwind variant: `@custom-variant dark (&:is(.dark *))`
- Always use semantic color naming (e.g., `text-foreground`, `bg-background`)

## Development Guidelines

### Package Manager
- **Always use pnpm** - Never use npm or yarn

### Code Style
- **ALWAYS use arrow functions** - Never use function declarations or function expressions
  - Use `const functionName = () => {}` for all functions
  - Use `const functionName = async () => {}` for async functions
  - Use arrow functions for all callbacks, event handlers, and utility functions
- **If/Else Statement Formatting**:
  - **Single-line if statements** - Remove braces for single-line conditions
  - **If-else consistency** - Match the formatting between if and else:
    - If both are single-line: No braces for either
    - If one is multi-line: Use braces for both
  - Examples:
    ```typescript
    // ✅ GOOD - Both single-line, no braces
    if (condition) doSomething();
    else doSomethingElse();

    // ✅ GOOD - One is multi-line, both use braces
    if (condition) {
      doSomething();
      doMore();
    } else {
      doSomethingElse();
    }

    // ❌ BAD - Inconsistent formatting
    if (condition) doSomething();
    else {
      doSomethingElse();
      doMore();
    }
    ```
- **Object parameters** - Use for functions with more than 2 parameters
- **Static objects** - Define outside components to prevent recreation

### Component Architecture

#### Server/Client Separation
- Keep `page.tsx` and `layout.tsx` as server components
- Create separate client components when needed
- Never add "use client" to server components

#### Component Structure Order
1. State declarations
2. Callbacks
3. **ALL useEffects** (immediately before return statement)
4. Return statement

#### Interface Location
- Component interfaces immediately before component definition
- Shared interfaces in `/types` folder

### React Best Practices

#### useEffect Guidelines
- **Minimal dependencies** - Only include what's actually used AND should trigger re-runs
- **Avoid circular dependencies** - Never include state that the effect updates
- **Prefer derived state** - Compute values directly instead of useEffect when possible
- **Memory leak prevention** - Use isMountedRef pattern for async operations
- **Always clean up** - Return cleanup function for subscriptions, timers, listeners

#### Performance Optimization
- **ALWAYS use useCallback/useMemo** when passing to child components
- **Don't over-optimize** - Only memoize when necessary
- **Prefer derived state over useEffect** for computed values

### UI Component Usage

#### Button Component
- **ALWAYS use shadcn/ui Button** with ONLY variants and sizes
- **NEVER add styling classes** that duplicate variant styles
- Available variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `primary`, `gradient`, `link`
- Available sizes: `sm`, `default`, `lg`, `xl`, `icon`

**Only add className for:**
- Layout positioning (`w-full`, `flex-1`, `justify-start`)
- Conditional states (`isOpen && "border-primary"`)

#### Typography Components
When implementing designs, ALWAYS use typography components from `@/components/ui/typography.tsx`:
- `TypographyH1` through `TypographyH4` for headings
- `TypographyRegular`, `TypographyMedium` for body text
- `TypographySmallReg`, `TypographySmallMedium` for smaller text
- `TypographyMiniReg`, `TypographyMiniMedium` for tiny text
- `TypographyMono` for monospace text

### Next.js Patterns

#### Redirect Usage
- **NEVER place redirect() inside try-catch blocks**
- redirect() throws internally to trigger navigation

```typescript
// ✅ GOOD
const data = await fetchData();
if (!data) redirect('/error');

// ❌ BAD
try {
  if (!data) redirect('/error'); // Gets caught!
} catch (error) {
  // Redirect fails
}
```

### Error Checking Protocol
After completing work on any file:
1. Run `pnpm tsc --noEmit` to check TypeScript errors
2. Run `pnpm lint` to check ESLint errors (fix errors, not warnings)
3. Fix ALL errors before moving to next task

### Code Review Mindset
- Always question if implementation is correct
- Push back on incorrect requirements
- Provide constructive feedback
- Check for latest best practices (current year: 2025)
- Review implementation holistically
- Prefer native solutions over reinventing the wheel

## Authentication Setup

### NextAuth Configuration
- **Provider**: Google OAuth configured in `lib/auth/auth.ts`
- **Session Management**: SessionProvider wraps the app in `components/providers.tsx`
- **Environment Variables Required**:
  - `NEXTAUTH_SECRET`: Secret key for JWT encryption
  - `NEXTAUTH_URL`: Application URL (http://localhost:3000 for development)
  - `GOOGLE_CLIENT_ID`: From Google Cloud Console
  - `GOOGLE_CLIENT_SECRET`: From Google Cloud Console

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.developers.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Set Authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-domain.com/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env.local`

## Important Notes

- **PNPM Required**: This project uses PNPM workspaces
- **Locale Validation**: Layout validates locale and returns 404 for invalid locales
- **Static Generation**: Uses `generateStaticParams()` for all locale variants
- **Prisma Setup**: Connected to Supabase PostgreSQL database with User and Todo models