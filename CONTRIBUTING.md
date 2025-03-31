# Contributing to Simple

Thank you for your interest in contributing to our project! This guide will help you get started with the development process and ensure a smooth collaboration.

## Development Setup

### Prerequisites

- Node.js 22+
- PNPM 10+

### Getting Started

1. Fork and clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build the packages:

   ```bash
   pnpm build
   ```

## Monorepo Structure

- `packages/`: Core packages
  - `@csrf/`: CSRF protection packages
  - `@simple/`: Utility packages
  - Configuration packages (`eslint-config`, `typescript-config`, etc.)
- `examples/`: Example applications showcasing the packages
  - `@csrf/`: CSRF examples
  - `@simple/`: Simple examples

## Development Workflow

### Running in Development Mode

```bash
pnpm dev
```

### Testing

```bash
# Run all tests
pnpm test

# Test specific package
pnpm --filter @csrf/core test
```

### Linting and Type Checking

```bash
# Run linting
pnpm lint

# Run type checking
pnpm check-types
```

## Pull Request Process

1. Create a branch with a descriptive name:

   ```bash
   feature/add-new-csrf-feature
   fix/resolve-issue-123
   ```

2. Make your changes and commit them with clear messages
3. Push your branch and open a Pull Request
4. Ensure all CI checks pass
5. Request a review from maintainers

## Versioning and Releases

We use semantic versioning (SEMVER) for all packages. When making changes:

- `patch`: Bug fixes and minor changes
- `minor`: New features (non-breaking)
- `major`: Breaking changes

## Code Style and Conventions

- Follow the existing code style (enforced by ESLint and Prettier)
- Write tests for all new features and bug fixes
- Update documentation as needed

Thank you for contributing!
