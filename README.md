# Simple

[![MIT License](https://img.shields.io/npm/l/@simple-csrf/core.svg)](https://github.com/infinity-atom42/Simple/blob/main/LICENSE)

A monorepo of simple, well-designed JavaScript packages focused primarily on Next.js and modern web development.

## Overview

This repository hosts a collection of open-source packages designed to solve common problems in web development with a focus on simplicity, security, and developer experience. By using a monorepo structure, we maintain consistent quality, configuration, and dependency management across all packages.

## Current Packages

| Package | Description |
|---------|-------------|
| [@simple-csrf](./packages/@simple-csrf) | A suite of CSRF protection packages for JavaScript applications using the signed double submit cookie pattern |

### @simple-csrf Packages

The @simple-csrf collection includes:

- **[@simple-csrf/core](./packages/@simple-csrf/core)**: Core CSRF protection functionality for Node.js and edge runtimes
- **[@simple-csrf/express](./packages/@simple-csrf/express)**: Express.js middleware for CSRF protection
- **[@simple-csrf/next](./packages/@simple-csrf/next)**: Next.js middleware, components, and hooks for CSRF protection

## Why a Monorepo?

This project uses a monorepo structure for several key benefits:

- **Simplified dependency management**: Share dependencies across packages and update them in one place
- **Consistent configuration**: Use the same linting, testing, and build configurations for all packages
- **Atomic changes**: Make changes across multiple packages in a single commit
- **Coordinated versioning**: Easily manage inter-package dependencies
- **Streamlined CI/CD**: Run tests and deployments for all packages from a single pipeline

## Development Focus

While the repository includes packages for various JavaScript frameworks, our primary focus is on Next.js and its ecosystem. Future packages will prioritize Next.js integration while maintaining compatibility with other frameworks where appropriate.

## Getting Started

Each package has its own README with installation instructions and usage examples. Navigate to the specific package directories to learn more.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See the [CONTRIBUTING.md](./CONTRIBUTING.md) file for more details.
