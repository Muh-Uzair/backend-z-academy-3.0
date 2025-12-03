# Backend Z Academy 3.0

A Node.js + Express + TypeScript backend project with ESM support.

## Features

- ✅ **ESM (ES Modules)** - Modern import/export syntax
- ✅ **TypeScript** - Type-safe development
- ✅ **Import Aliases** - Clean imports with `@/` prefix
- ✅ **ESLint** - Real-time error checking in your IDE
- ✅ **Node.js --watch** - Built-in file watching (no nodemon needed)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Run the development server with Node.js built-in watch mode:

```bash
npm run dev
```

The server will automatically restart when you make changes to your files.

### Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Production

Run the compiled JavaScript:

```bash
npm start
```

### Linting

Check for linting errors:

```bash
npm run lint
```

### Type Checking

Check TypeScript types without building:

```bash
npm run type-check
```

## Project Structure

```
src/
  ├── config/       # Configuration files
  ├── controllers/  # Route controllers
  ├── middleware/   # Express middleware
  ├── routes/       # Route definitions
  ├── types/        # TypeScript type definitions
  ├── utils/        # Utility functions
  └── index.ts      # Application entry point
```

## Import Aliases

You can use these import aliases throughout your project:

- `@/` - Points to `src/`
- `@/config/*` - Configuration files
- `@/routes/*` - Route files
- `@/controllers/*` - Controller files
- `@/middleware/*` - Middleware files
- `@/utils/*` - Utility files
- `@/types/*` - Type definitions

Example:

```typescript
import { config } from "@/config/index.js";
import { someUtil } from "@/utils/helpers.js";
```

## ESLint Configuration

ESLint is configured to work in real-time with your IDE. Make sure your editor has ESLint extension installed:

- **VS Code**: ESLint extension
- **WebStorm/IntelliJ**: Built-in ESLint support

The configuration will show errors and warnings as you type, without needing to run `npm run lint`.
