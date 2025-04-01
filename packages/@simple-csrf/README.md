# @simple-csrf

[![MIT License](https://img.shields.io/npm/l/@simple-csrf/core.svg)](https://github.com/infinity-atom42/Simple/blob/main/LICENSE)

A collection of packages providing simple, effective CSRF (Cross-Site Request Forgery) protection for JavaScript applications using the [signed double submit cookie pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#signed-double-submit-cookie-recommended).

## What is @simple-csrf?

@simple-csrf is a secure, flexible, and easy-to-use CSRF protection suite designed to work across different JavaScript frameworks and environments. It implements the OWASP-recommended signed double submit cookie pattern to provide robust protection against CSRF attacks.

## Packages

This repository contains the following packages:

| Package | Description | npm |
|---------|-------------|-----|
| [@simple-csrf/core](./core) | Core functionality for CSRF protection that works in both Node.js and edge runtime environments | [![npm version](https://img.shields.io/npm/v/@simple-csrf/core.svg)](https://www.npmjs.com/package/@simple-csrf/core) |
| [@simple-csrf/express](./express) | Express.js middleware for CSRF protection | [![npm version](https://img.shields.io/npm/v/@simple-csrf/express.svg)](https://www.npmjs.com/package/@simple-csrf/express) |
| [@simple-csrf/next](./next) | Next.js middleware, components, and hooks for CSRF protection | [![npm version](https://img.shields.io/npm/v/@simple-csrf/next.svg)](https://www.npmjs.com/package/@simple-csrf/next) |

## Key Features

- **Framework Integrations**: Ready-to-use implementations for Express.js and Next.js
- **Edge Compatible**: Works in both Node.js and edge runtime environments
- **Modern Security**: Implements OWASP-recommended patterns for CSRF protection
- **Flexible Configuration**: Customizable token generation, validation, and cookie settings
- **TypeScript Support**: Fully typed API for improved developer experience
- **Simple API**: Easy to integrate into existing applications

## How It Works

The @simple-csrf packages implement the signed double submit cookie pattern:

1. A secure, HTTP-only cookie containing a secret is set on the client
2. A CSRF token derived from this secret is generated and sent to the client
3. The client includes this token in subsequent requests
4. The server verifies that the token matches what would be derived from the secret cookie

This approach protects against CSRF attacks because:

- The attacker's site cannot read the HTTP-only cookie
- The attacker cannot forge a valid CSRF token without knowing the secret
- Each token is cryptographically signed to prevent tampering

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
