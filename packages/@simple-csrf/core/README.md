# @simple-csrf/core

[![npm version](https://img.shields.io/npm/v/@simple-csrf/core.svg)](https://www.npmjs.com/package/@simple-csrf/core)
[![MIT License](https://img.shields.io/npm/l/@simple-csrf/core.svg)](https://github.com/infinity-atom42/Simple/blob/main/LICENSE)

CSRF core package used alone or useful to create other packages. This package implements the [signed double submit cookie pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#signed-double-submit-cookie-recommended) for JavaScript applications and is designed to run in both Node.js and edge runtime environments.

This is the low-level core package which provides the foundation for the integration packages. It's most useful for creating custom integrations or when you need direct control over CSRF protection.

## Table of Contents

- [Integration Packages](#integration-packages)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [createCsrfProtect](#createcsrfprotectoptions-partialconfigoptions)
  - [Configuration Options](#configuration-options)
  - [CsrfProtect Function](#csrfprotect-function)
- [Token Validation](#token-validation)
- [Creating a Custom Integration](#creating-a-custom-integration)
- [Compatibility](#compatibility)
- [Contributing](#contributing)

## Integration Packages

For most applications, it's recommended to use one of the following integration packages:

| Package                  | GitHub                                                                                        | npm                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **@simple-csrf/next**    | [GitHub](https://github.com/infinity-atom42/Simple/tree/main/packages/%40simple-csrf/next)    | [npm](https://www.npmjs.com/package/@simple-csrf/next)    |
| **@simple-csrf/express** | [GitHub](https://github.com/infinity-atom42/Simple/tree/main/packages/%40simple-csrf/express) | [npm](https://www.npmjs.com/package/@simple-csrf/express) |

## Installation

```bash
npm install @simple-csrf/core
# or
pnpm add @simple-csrf/core
# or
yarn add @simple-csrf/core
```

## Usage

The core package exports modules that can be imported directly:

```typescript
import { createCsrfProtect } from '@simple-csrf/core/protect'
import { Config, CookieOptions } from '@simple-csrf/core/config'
import { createToken, verifyToken } from '@simple-csrf/core/util'

// Create a CSRF protection function with custom config
const csrfProtect = createCsrfProtect({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    name: '_csrf_secret',
    // ... other cookie options
  },
  // ... other config options
})

// Use the protect function with a request
const csrfToken = await csrfProtect({
  request: req, // Request object
  url: { pathname: req.url }, // URL object with pathname
  getCookie: (name) => cookies.get(name), // Function to get cookie
  setCookie: (cookie) => cookies.set(cookie), // Function to set cookie
})

// The returned token can be used in forms or response headers
```

## API Reference

### `createCsrfProtect(options?: Partial<ConfigOptions>)`

Creates a CSRF protection function with the specified configuration options.

```typescript
import { createCsrfProtect } from '@simple-csrf/core/protect'
```

**Parameters:**

- `options` (optional): Configuration options for CSRF protection

**Returns:**

- A function of type `CsrfProtect` that can be called to validate requests and generate tokens

### Configuration Options

The configuration object can include the following properties:

```typescript
import { ConfigOptions } from '@simple-csrf/core/config'

interface ConfigOptions {
  // Prefixes of paths that should be excluded from CSRF protection
  excludePathPrefixes?: string[]

  // HTTP methods to ignore (default: ['GET', 'HEAD', 'OPTIONS'])
  ignoreMethods?: string[]

  // Length of the salt in bytes (default: 8)
  saltByteLength?: number

  // Length of the secret in bytes (default: 18)
  secretByteLength?: number

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
  }>
}
```

### `CsrfProtect` Function

The function returned by `createCsrfProtect` has the following signature:

```typescript
async function csrfProtect(args: CsrfProtectArgs): Promise<string | undefined>
```

**Parameters:**

- `args`: An object containing:
  - `request`: The request object
  - `url`: An object with a `pathname` property
  - `getCookie`: A function to retrieve cookie values by name
  - `setCookie`: A function to set cookies

**Returns:**

- A string containing the CSRF token for the next request
- `undefined` if the path is excluded from CSRF protection

**Throws:**

- `CsrfError` if CSRF validation fails

## Token Validation

The CSRF token is validated by retrieving it from one of the following sources (in order):

1. Custom token value function (if provided)
2. `x-csrf-token` header
3. Form data field with the configured name (default: `csrf_token`)
4. JSON request body field with the configured name
5. Raw request body text

The token validation process uses the `getTokenString` and `verifyToken` functions from the `util` module:

```typescript
import { getTokenString, verifyToken } from '@simple-csrf/core/util'
```

When a request is processed:

1. The secret is retrieved from the cookie or a new one is generated if it doesn't exist
2. The token is extracted from the request using the appropriate method
3. The token is verified against the secret using cryptographic techniques
4. A new token is generated for the next request

## Creating a Custom Integration

You can create a custom integration by wrapping the `createCsrfProtect` function:

```typescript
import { createCsrfProtect, ConfigOptions } from '@simple-csrf/core/protect'
import { CsrfError } from '@simple-csrf/core/protect'

export function createMyCsrfMiddleware(config?: Partial<ConfigOptions>) {
  const csrfProtect = createCsrfProtect(config)

  return async (req, res, next) => {
    try {
      // Implement the request/response handler using csrfProtect
      const token = await csrfProtect({
        request: req,
        url: { pathname: req.path },
        getCookie: (name) => req.cookies[name],
        setCookie: (cookie) => {
          res.cookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            httpOnly: cookie.httpOnly,
            maxAge: cookie.maxAge,
            partitioned: cookie.partitioned,
            path: cookie.path,
            sameSite: cookie.sameSite,
            secure: cookie.secure,
          })
        },
      })

      // Set the token in the response header
      if (token) {
        res.setHeader('X-CSRF-Token', token)
      }

      next()
    } catch (error) {
      // Handle CSRF errors
      if (error instanceof CsrfError) {
        res.status(403).send('CSRF validation failed')
      } else {
        next(error)
      }
    }
  }
}
```

## Compatibility

This package is designed to work in both Node.js and edge runtime environments:

- **Node.js**: Developed and tested with Node.js 22.x
- **Edge Runtimes**: Compatible with all major edge runtimes (Vercel Edge Functions, Cloudflare Workers, etc.)
- **Browsers**: Not intended for direct use in browsers

## Contributing

We welcome contributions and bug reports! Please open an issue or pull request on our [GitHub repository](https://github.com/infinity-atom42/Simple).
