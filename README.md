# OurBride Web Application

A modern, scalable web application for wedding planning and services, built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.17.0
- npm >= 9.0.0

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
# or
npm start
```

The application will be available at `http://localhost:3005`

### Build
```bash
npm run build
```

### Type Checking
```bash
npm run typecheck
```

### Format Code
```bash
npm run format.fix
```

## 📁 Project Structure

The project follows industry best practices with a well-organized folder structure:

```
src/
├── Components/          # React components (organized by type)
│   ├── ui/             # Primitive UI components
│   ├── layout/         # Layout components
│   ├── forms/          # Form components
│   ├── common/         # Shared components
│   ├── features/       # Feature-specific components
│   ├── Community/      # Community subdomain
│   └── Guider/         # Guider subdomain
├── Hooks/              # Custom React hooks
├── pages/              # Page-level components
├── services/           # API service functions
├── utils/              # Utility functions
├── lib/                # Library configurations
├── types/              # TypeScript types
├── constants/          # Application constants
├── context/            # React Context providers
├── store/              # Zustand stores
├── styles/             # Global styles and theme
└── assets/             # Static assets
```

## 🔧 Key Features

- **Multi-subdomain Architecture**: Main app, Community, and Guider subdomains
- **TypeScript**: Full type safety
- **Modern React**: React 18 with hooks
- **State Management**: Zustand for global state
- **Data Fetching**: React Query for server state
- **Routing**: React Router v6
- **Styling**: Bootstrap 5 + Styled Components + Tailwind CSS
- **Form Handling**: React Hook Form
- **Path Aliases**: Clean imports with `@/*` alias

## 📚 Documentation

- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Complete getting started guide
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed structure documentation
- **[README_STRUCTURE.md](./README_STRUCTURE.md)** - Quick reference guide

## 🎯 Import Patterns

### Using Path Aliases (Recommended)
```tsx
import { Button } from '@/Components/ui';
import { useAuth } from '@/Hooks';
import { serviceService } from '@/services';
import { ROUTES } from '@/constants';
```

### Using Relative Imports (Also Works)
```tsx
import Button from './Components/ui/Button';
import { useAuth } from './Hooks/useAuth';
```

Both patterns work! Use path aliases for new code.

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`:

```bash
VITE_API_BASE_URL=your_api_url
VITE_FIREBASE_API_KEY=your_firebase_key
# ... see .env.example for all variables
```

## 🧪 Testing

```bash
npm test
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router 6** - Routing
- **Zustand** - State management
- **React Query** - Data fetching
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Styled Components** - CSS-in-JS
- **Bootstrap 5** - UI framework
- **Tailwind CSS** - Utility-first CSS

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run typecheck` - Type check without building
- `npm run format.fix` - Format code with Prettier

## 🚦 Development Workflow

1. Create a feature branch
2. Make changes following the project structure
3. Test locally with `npm run dev`
4. Type check with `npm run typecheck`
5. Format code with `npm run format.fix`
6. Commit and push

## 📖 Additional Resources

- See individual `README.md` files in each directory for specific guidance
- Check `GETTING_STARTED.md` for detailed development guide
- Review `PROJECT_STRUCTURE.md` for architecture details

## 🤝 Contributing

1. Follow the project structure guidelines
2. Use TypeScript for all new code
3. Follow existing code patterns
4. Add barrel exports for new components/hooks/utils
5. Update documentation as needed

## 📄 License

[Your License Here]

---

**Ready to start developing!** Check out [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed instructions.
