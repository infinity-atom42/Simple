# @simple-csrf/express

[![npm version](https://img.shields.io/npm/v/@simple-csrf/express.svg)](https://www.npmjs.com/package/@simple-csrf/express)
[![MIT License](https://img.shields.io/npm/l/@simple-csrf/express.svg)](https://github.com/infinity-atom42/Simple/blob/main/LICENSE)

A simple to use CSRF protection package for Express applications. This integration provides middleware that implements the [signed double submit cookie pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#signed-double-submit-cookie-recommended) to protect your Express applications from CSRF attacks.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [createCsrfMiddleware](#createcsrfmiddleware)
  - [createCsrfProtect](#createcsrfprotect)
  - [Configuration Options](#configuration-options)
- [Token Usage](#token-usage)
- [Examples](#examples)
- [Compatibility](#compatibility)
- [Related Packages](#related-packages)
- [Contributing](#contributing)

## Installation

```bash
npm install @simple-csrf/express
# or
pnpm add @simple-csrf/express
# or
yarn add @simple-csrf/express
```

Note: This package has peer dependencies on `express` and `cookie`. Make sure they are installed in your project:

```bash
npm install express cookie
```

## Quick Start

Here's a basic example of how to use the CSRF middleware in an Express application:

```javascript
import { createCsrfMiddleware } from '@simple-csrf/express'
import express from 'express'

// Initialize CSRF protection middleware
const csrfMiddleware = createCsrfMiddleware({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  },
})

// Initialize app
const app = express()

// Add CSRF middleware
app.use(csrfMiddleware)

// Define routes
app.get('/', (req, res) => {
  const csrfToken = res.getHeader('X-CSRF-Token') || 'missing'
  res.send(`
    <!doctype html>
    <html>
      <body>
        <form action="/form-handler" method="post">
          <input type="hidden" name="csrf_token" value="${csrfToken}" />
          <input type="text" name="input1" />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `)
})

app.post('/form-handler', (req, res) => {
  res.send('Form submitted successfully!')
})

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

With this setup, all HTTP submission requests (e.g., POST, PUT, DELETE, PATCH) will be rejected if they do not include a valid CSRF token.

## API Reference

### createCsrfMiddleware

Creates an Express middleware function that provides CSRF protection.

```javascript
import { createCsrfMiddleware } from '@simple-csrf/express'

const middleware = createCsrfMiddleware(options)
app.use(middleware)
```

**Parameters:**

- `options` (optional): Configuration options for CSRF protection

**Returns:**

- An Express middleware function of type `RequestHandler`

### createCsrfProtect

Creates a lower-level CSRF protection function that can be used for more custom integrations.

```javascript
import { createCsrfProtect } from '@simple-csrf/express'

const protect = createCsrfProtect(options)
```

**Parameters:**

- `options` (optional): Configuration options for CSRF protection

**Returns:**

- A function of type `ExpressCsrfProtect` that can be called to validate requests and generate tokens

### Configuration Options

The configuration object can include the following properties:

```typescript
interface ExpressConfigOptions {
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

    // The name of the response header containing the CSRF token (default: 'X-CSRF-Token')
    responseHeader: string
  }>
}
```

## Token Usage

When a request is processed by the middleware:

1. The server generates a CSRF token and sets it in the response header (default: `X-CSRF-Token`)
2. The token must be included in subsequent requests that modify state (POST, PUT, DELETE, etc.)

The middleware will look for the token in the following places (in order):

1. Custom token value function (if provided)
2. `X-CSRF-Token` header
3. Form data field with the configured name (default: `csrf_token`)
4. JSON request body field with the configured name
5. Raw request body text

### Including the Token in Forms

```html
<form
  method="post"
  action="/submit">
  <input
    type="hidden"
    name="csrf_token"
    value="TOKEN_VALUE_HERE" />
  <!-- other form fields -->
  <button type="submit">Submit</button>
</form>
```

### Including the Token in AJAX Requests

```javascript
// Using fetch
fetch('/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': 'TOKEN_VALUE_HERE',
  },
  body: JSON.stringify({ data: 'example' }),
})

// Using axios
axios.post('/api/data', { data: 'example' }, { headers: { 'X-CSRF-Token': 'TOKEN_VALUE_HERE' } })
```

## Examples

### Excluding Specific Routes

You can exclude specific routes from CSRF protection:

```javascript
const csrfMiddleware = createCsrfMiddleware({
  excludePathPrefixes: ['/api/webhook/', '/public/'],
})
```

### Custom Error Handling

For custom error handling, you can use the lower-level `createCsrfProtect` function:

```javascript
import { createCsrfProtect, CsrfError } from '@simple-csrf/express'

const csrfProtect = createCsrfProtect()

app.use(async (req, res, next) => {
  try {
    await csrfProtect(req, res)
    next()
  } catch (error) {
    if (error instanceof CsrfError) {
      res.status(403).json({ error: 'Invalid CSRF token' })
    } else {
      next(error)
    }
  }
})
```

### Complete Application Example

A complete example application is available in the [examples directory](https://github.com/infinity-atom42/Simple/tree/main/examples/%40simple-csrf/express).

## Compatibility

This package requires:

- **Express**: Version 5.x
- **Cookie**: Version 1.x
- **Node.js**: Developed and tested with Node.js 22.x

## Related Packages

The following packages are part of the @simple-csrf ecosystem:

| Package               | Description                                                | GitHub                                                                                     | npm                                                    |
| --------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| **@simple-csrf/core** | Core implementation with utilities for custom integrations | [GitHub](https://github.com/infinity-atom42/Simple/tree/main/packages/%40simple-csrf/core) | [npm](https://www.npmjs.com/package/@simple-csrf/core) |
| **@simple-csrf/next** | Next.js integration for CSRF protection                    | [GitHub](https://github.com/infinity-atom42/Simple/tree/main/packages/%40simple-csrf/next) | [npm](https://www.npmjs.com/package/@simple-csrf/next) |

## Contributing

We welcome contributions and bug reports! Please open an issue or pull request on our [GitHub repository](https://github.com/infinity-atom42/Simple).
