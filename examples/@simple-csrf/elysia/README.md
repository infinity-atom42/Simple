# @simple-csrf/elysia Example

This is a working example demonstrating how to use `@simple-csrf/elysia` to protect an ElysiaJS application from CSRF attacks.

## Getting Started

First, install dependencies:

```bash
bun install
```

## Development

To start the development server, run:

```bash
bun run dev
```

Open <http://localhost:3000/> with your browser to see the result.

## What This Example Demonstrates

- Setting up CSRF protection for an Elysia application
- Accessing CSRF tokens in route handlers
- Embedding CSRF tokens in HTML forms
- Handling form submissions with CSRF validation
- Custom cookie configuration

## Key Features

The example includes:

1. A form page that displays the CSRF token
2. CSRF protection middleware configuration
3. Automatic rejection of requests without valid tokens
4. Success page after valid form submission

## Learn More

For more information about `@simple-csrf/elysia`, check out the [package documentation](../../packages/@simple-csrf/elysia/README.md).
