# @repo/vitest-config

Vitest configuration presets for Infinity projects. These configurations provide a consistent foundation for testing across different types of projects.

## Installation

```bash
# Using npm
npm install --save-dev @repo/vitest-config vitest

# Using yarn
yarn add --dev @repo/vitest-config vitest

# Using pnpm
pnpm add -D @repo/vitest-config vitest
```

For UI components and React testing, we recommend also installing:

```bash
pnpm add -D @testing-library/dom@10.4.0 @testing-library/react@16.2.0
```

## Available Configurations

This package includes the following configurations:

### Base Configuration

Basic Vitest configuration with Istanbul coverage reporting:

```js
// vitest.config.ts
import { baseConfig } from '@repo/vitest-config/base'

export default baseConfig
```

### UI Configuration

Configuration for testing React components with JSDOM environment:

```js
// vitest.config.ts
import { uiConfig } from '@repo/vitest-config/ui'

export default uiConfig
```

## Extending Configurations

You can customize the configurations by extending them:

```js
// vitest.config.ts
import { configDefaults, defineConfig } from 'vitest/config'
import { mergeConfig } from 'vitest/config'
import { baseConfig } from '@repo/vitest-config/base'

export default mergeConfig(baseConfig, {
  test: {
    // Include patterns for test files
    include: ['**/*.{test,spec}.{ts,tsx}'],

    // Exclude specific patterns that make sense
    exclude: [
      // Extend the default excludes
      ...configDefaults.exclude,
      // Add custom excludes for your project
      '**/e2e/**', // End-to-end tests handled separately
      '**/__mocks__/**', // Mock files
      '**/test-utils/**', // Test utilities
      '**/fixtures/**', // Test fixtures
    ],
  },
})
```

### Testing Library Examples

#### React Component Testing

```tsx
// Button.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeVisible()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

For more detailed examples, see the [React Testing Library documentation](https://testing-library.com/docs/react-testing-library/example-intro)

#### DOM Testing

```ts
// utils.test.ts
import { describe, it, expect } from 'vitest'
import { screen, within } from '@testing-library/dom'
import { createTooltip } from './utils'

describe('createTooltip', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="container"></div>'
  })

  it('creates a tooltip with the correct text', () => {
    const container = document.getElementById('container')
    createTooltip(container, 'Helpful information')

    const tooltip = screen.getByRole('tooltip')
    expect(tooltip).toBeInTheDocument()
    expect(within(tooltip).getByText('Helpful information')).toBeVisible()
  })
})
```
