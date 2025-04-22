# retry-loop

[![npm version](https://badge.fury.io/js/retry-loop.svg)](https://www.npmjs.com/package/retry-loop)

A lightweight, type-safe retry mechanism for TypeScript/JavaScript functions. `retry-loop` provides a simple yet powerful way to handle transient failures in asynchronous operations with customizable retry strategies.

## Features

- 🔄 Automatic retry mechanism for failed operations
- ⚙️ Configurable retry attempts and delay intervals
- 🎯 Type-safe implementation with TypeScript
- 🔔 Customizable callbacks for error handling and retry events
- 🎯 Flexible retry conditions through custom predicates
- 🚀 Zero dependencies
- 📦 Works with both Node.js and browser environments

## Installation

```bash
# Using npm
npm install retry-loop

# Using yarn
yarn add retry-loop

# Using bun
bun add retry-loop
```

## Quick Start

```typescript
import retryLoop from 'retry-loop';

// Basic usage
const fetchWithRetry = retryLoop(async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
});

// Advanced usage with options
const fetchWithAdvancedRetry = retryLoop(
  async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },
  {
    retries: 5,
    delay: 1000,
    onError: (error) => console.error('Attempt failed:', error),
    onSuccess: (data) => console.log('Successfully fetched:', data),
    onRetry: (attempt) => console.log(`Retrying... Attempt ${attempt}`),
    shouldRetry: (error) => error instanceof Error && error.message.includes('timeout'),
  }
);
```

## API Reference

### `retryLoop<T, Params extends any[]>(fn: (...args: Params) => Promise<T>, options?: RetryLoopOptions<T>)`

Creates a retry-loop version of the provided async function.

#### Parameters

- `fn`: The async function to make retry loop
- `options`: Optional configuration object

#### Options

```typescript
interface RetryLoopOptions<T> {
  retries?: number;          // Number of retry attempts (default: 3)
  delay?: number;            // Delay between retries in milliseconds (default: 500)
  onError?: (error: unknown) => void;  // Callback for error events
  onSuccess?: (result: T) => void;     // Callback for successful execution
  onRetry?: (attempt: number) => void; // Callback for retry events
  shouldRetry?: (error: unknown) => boolean; // Predicate to determine if retry should occur
}
```

## Examples

### Basic Retry

```typescript
const getData = retryLoop(async (id: string) => {
  const response = await fetch(`/api/data/${id}`);
  return response.json();
});
```

### Custom Retry Logic

```typescript
const uploadFile = retryLoop(
  async (file: File) => {
    // Upload logic here
  },
  {
    retries: 5,
    delay: 2000,
    shouldRetry: (error) => {
      return error instanceof Error && 
        (error.message.includes('network') || 
         error.message.includes('timeout'));
    }
  }
);
```

### With Event Handlers

```typescript
const processData = retryLoop(
  async (data: any) => {
    // Processing logic here
  },
  {
    onError: (error) => console.error('Processing failed:', error),
    onSuccess: (result) => console.log('Processing successful:', result),
    onRetry: (attempt) => console.log(`Retry attempt ${attempt}`)
  }
);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
