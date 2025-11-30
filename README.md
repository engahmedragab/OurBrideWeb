# OurBrideWeb

A modern wedding planning web application built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **UI Components**: Radix UI primitives with custom Tailwind styling

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (Button, etc.)
│   ├── layout/         # Layout components
│   ├── forms/          # Form components
│   ├── common/         # Common shared components
│   ├── features/       # Feature-specific components
│   ├── community/      # Community-related components
│   └── guider/         # Guider-related components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
│   └── api/           # API client configuration
├── lib/               # Utility libraries
│   ├── utils.ts       # Utility functions (cn, etc.)
│   └── reactQuery.ts  # React Query configuration
├── utils/             # Helper utilities
├── types/             # TypeScript type definitions
├── constants/         # Application constants
├── context/           # React context providers
├── store/             # Zustand stores
├── config/            # Configuration files
├── assets/            # Static assets
└── styles/            # Global styles
    └── globals.css    # Tailwind CSS imports
```

## Setup Instructions

### Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your actual configuration values

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3005`

### Build

Build for production:

```bash
npm run build
```

### Type Checking

Run TypeScript type checking:

```bash
npm run typecheck
```

### Code Formatting

Check formatting:

```bash
npm run format
```

Fix formatting issues:

```bash
npm run format:fix
```

### Linting

Run ESLint:

```bash
npm run lint
```

Fix linting issues:

```bash
npm run lint:fix
```

## Development Guidelines

### File Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAuth.ts`, `useFetch.ts`)
- **Utils**: camelCase (`formatDate.ts`, `validation.ts`)
- **Types**: PascalCase with `.types.ts` (`User.types.ts`)
- **Constants**: File in camelCase, exports in UPPER_SNAKE_CASE
- **Pages**: PascalCase (`HomePage.tsx`, `LoginPage.tsx`)

### Import Paths

Use path aliases for cleaner imports:

```typescript
// ✅ Good
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

// ❌ Bad
import { Button } from '../../../components/ui/Button'
```

### Styling

- Use Tailwind CSS for all styling
- Use the `cn()` utility function for conditional classes
- Follow the component variant pattern using `class-variance-authority`
- No Bootstrap or Styled Components

### Code Organization

- Use barrel exports (`index.ts`) in each folder
- Keep components small and focused
- Separate concerns (UI, business logic, API calls)
- Use TypeScript strict mode

## Deeplinks Functionality

The `public/deeplinks/` folder contains deeplink configurations and should be preserved exactly as-is. This folder is critical for the application's deeplink functionality and should never be modified or deleted during project reinitialization.

## Environment Variables

Required environment variables (see `.env.example`):

- `VITE_API_BASE_URL`: Base URL for the API
- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase authentication domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
- `VITE_APP_ENV`: Application environment (development/production)

## API Client

The API client is configured in `src/services/api/client.ts` with:

- Automatic token injection from localStorage
- Request/response interceptors
- Error handling for 401 unauthorized responses

## React Query

React Query is configured with:

- 5-minute stale time
- No automatic refetch on window focus
- Single retry on failure

## License

Private project
