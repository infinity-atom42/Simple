# @simple-csrf/next

[![npm version](https://img.shields.io/npm/v/@simple-csrf/next.svg)](https://www.npmjs.com/package/@simple-csrf/next)
[![MIT License](https://img.shields.io/npm/l/@simple-csrf/next.svg)](https://github.com/infinity-atom42/Simple/blob/main/LICENSE)

A simple to use CSRF protection package for Next.js applications. This integration provides middleware and React components that implement the [signed double submit cookie pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#signed-double-submit-cookie-recommended) to protect your Next.js applications from CSRF attacks.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Middleware](#middleware)
  - [Server Component APIs](#server-component-apis)
  - [Client Component APIs](#client-component-apis)
  - [Configuration Options](#configuration-options)
- [Usage Examples](#usage-examples)
- [Compatibility](#compatibility)
- [Related Packages](#related-packages)
- [Contributing](#contributing)

## Installation

```bash
npm install @simple-csrf/next
# or
pnpm add @simple-csrf/next
# or
yarn add @simple-csrf/next
```

Note: This package is designed for Next.js 15 and requires React 19. Make sure your project meets these requirements.

## Quick Start

### 1. Set up the Middleware

Create a `middleware.ts` file in your project's root directory:

```typescript
import { createCsrfMiddleware } from '@simple-csrf/next'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}

export default createCsrfMiddleware({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
})
```

### 2. Add the Provider to Your Layout

Wrap your application with the `CsrfProvider` in your root layout:

```typescript
// app/layout.tsx
import { CsrfProvider } from '@simple-csrf/next/provider'

export default function RootLayout({ children }) {
  return <CsrfProvider>{children}</CsrfProvider>
}
```

### 3. Use CSRF Protection in Forms

#### Using CSRF in Server Components

In server components, you can directly fetch the CSRF token:

```typescript
// app/page.tsx
import { getCsrfToken } from '@simple-csrf/next'

export default async function Page() {
  const csrfToken = await getCsrfToken()

  return (
    <form method="post">
      <input type="hidden" name="csrf_token" value={csrfToken} />
      <input type="text" name="input" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

#### Using CSRF in Client Components

In client components, you can use the `useCsrfToken` hook or the `Csrf` component:

Example with `useCsrfToken` hook:

```typescript
'use client'
import { useCsrfToken } from '@simple-csrf/next/client'

export function ClientFormWithHook() {
  const csrfToken = useCsrfToken()

  return (
    <form method="post">
      <input type="hidden" name="csrf_token" value={csrfToken} />
      <button type="submit">Submit with Hook</button>
    </form>
  )
}
```

Example with `Csrf` component:

```typescript
'use client'
import { Csrf } from '@simple-csrf/next/client'

export function ClientFormWithComponent() {
  return (
    <form method="post">
      <Csrf />
      <button type="submit">Submit with Component</button>
    </form>
  )
}
```

## API Reference

### Middleware

| API                    | Description                                    | Import                                                     |
| ---------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| `createCsrfMiddleware` | Creates Next.js middleware for CSRF protection | `import { createCsrfMiddleware } from '@simple-csrf/next'` |
| `createCsrfProtect`    | Lower-level function for custom middleware     | `import { createCsrfProtect } from '@simple-csrf/next'`    |

### Server Component APIs

| API            | Description                              | Import                                                      |
| -------------- | ---------------------------------------- | ----------------------------------------------------------- |
| `CsrfProvider` | Provider component for server components | `import { CsrfProvider } from '@simple-csrf/next/provider'` |
| `getCsrfToken` | Get token in server components           | `import { getCsrfToken } from '@simple-csrf/next'`          |

### Client Component APIs

| API            | Description                   | Import                                                    |
| -------------- | ----------------------------- | --------------------------------------------------------- |
| `useCsrfToken` | Hook to access the token      | `import { useCsrfToken } from '@simple-csrf/next/client'` |
| `Csrf`         | Component that adds the token | `import { Csrf } from '@simple-csrf/next/client'`         |

### Configuration Options

```typescript
interface NextConfigOptions {
  // Prefixes of paths that should be excluded from CSRF protection
  excludePathPrefixes?: string[] // Default: ['/_next/']

  // HTTP methods to ignore
  ignoreMethods?: string[] // Default: ['GET', 'HEAD', 'OPTIONS']

  // Length of the salt in bytes
  saltByteLength?: number // Default: 8

  // Length of the secret in bytes
  secretByteLength?: number // Default: 18

  // Cookie configuration
  cookie?: Partial<{
    // Domain for the cookie (default: '')
    domain: string
    // Whether the cookie is HTTP only (default: true)
    httpOnly: boolean
    // Max age of the cookie in seconds (default: undefined)
    maxAge: number | undefined
    // Name of the cookie (default: '_csrfSecret')
    name: string
    // Whether the cookie is partitioned (default: undefined)
    partitioned: boolean | undefined
    // Path for the cookie (default: '/')
    path: string
    // SameSite attribute (default: 'strict')
    sameSite: boolean | 'none' | 'strict' | 'lax'
    // Whether the cookie requires HTTPS (default: true)
    secure: boolean
  }>

  // Token configuration
  token?: Partial<{
    // Name of the field for the token (default: 'csrf_token')
    fieldName: string
    // Custom function to retrieve token value from request
    value: (request: Request) => Promise<string>
    // The name of the response header containing the CSRF token (default: 'X-CSRF-Token')
    responseHeader: string // Default: 'X-CSRF-Token'
  }>
}
```

## Usage Examples

### Excluding Routes from CSRF Protection

You can exclude specific routes from CSRF protection:

```typescript
const middleware = createCsrfMiddleware({
  excludePathPrefixes: ['/api/webhook/', '/public/'],
})
```

### Custom Error Handling

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createCsrfProtect, CsrfError } from '@simple-csrf/next'

// initalize csrf protection method
const csrfProtect = createCsrfProtect({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
})

// Next.js middleware function
export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next()

  try {
    await csrfProtect(request, response)
  } catch (err) {
    if (err instanceof CsrfError) return new NextResponse('invalid csrf token', { status: 403 })
    throw err
  }

  return response
}
```

### Complete Application Example

A complete example application is available in the [examples directory](https://github.com/infinity-atom42/Simple/tree/main/examples/%40simple-csrf/nextjs-15).

## Compatibility

This package requires:

- **Next.js**: Version 15.x or higher
- **React**: Version 19.x or higher
- **React DOM**: Version 19.x or higher
- **Node.js**: Developed and tested with Node.js 22.x

> **Note:** This package is specifically designed for the App Router in Next.js and is not compatible with the Pages Router.

## Related Packages

The following packages are part of the @simple-csrf ecosystem:

| Package                  | Description                                                | GitHub                                                                                        | npm                                                       |
| ------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **@simple-csrf/core**    | Core implementation with utilities for custom integrations | [GitHub](https://github.com/infinity-atom42/Simple/tree/main/packages/%40simple-csrf/core)    | [npm](https://www.npmjs.com/package/@simple-csrf/core)    |
| **@simple-csrf/express** | Express integration for CSRF protection                    | [GitHub](https://github.com/infinity-atom42/Simple/tree/main/packages/%40simple-csrf/express) | [npm](https://www.npmjs.com/package/@simple-csrf/express) |

## Contributing

We welcome contributions and bug reports! Please open an issue or pull request on our [GitHub repository](https://github.com/infinity-atom42/Simple).
