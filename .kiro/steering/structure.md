# Project Structure & Organization

## Monorepo Structure (Turborepo)

```
├── apps/
│   ├── mobile/                 # React Native + Expo app
│   ├── web-admin/             # React web admin interface
│   ├── bff/                   # Hono BFF with tRPC proxy
│   └── external-api/          # REST API for external integrations
├── services/
│   ├── auth-service/          # NestJS authentication service
│   ├── inventory-service/     # NestJS inventory management
│   ├── organization-service/  # NestJS organization management
│   ├── notification-service/  # NestJS notification handling
│   ├── file-service/         # NestJS file/image management
│   └── product-service/      # NestJS product info & barcode
├── packages/
│   ├── shared-types/         # Common TypeScript types
│   ├── ui-components/        # Shared UI components (shadcn/ui)
│   ├── api-client/          # tRPC client configuration
│   ├── database/            # Prisma schema & migrations
│   ├── validation/          # Zod schemas & validators
│   └── error-handling/      # neverthrow Result types
├── infrastructure/
│   ├── pulumi/              # Infrastructure as Code
│   ├── k8s/                 # Kubernetes manifests
│   └── railway/             # Railway deployment configs
└── tools/
    ├── msw-mocks/           # MSW mock handlers
    ├── test-utils/          # Shared testing utilities
    └── scripts/             # Build & deployment scripts
```

## Application Structure Patterns

### Mobile App (`apps/mobile/`)
```
src/
├── components/              # Reusable UI components
│   ├── common/             # Generic components (Button, Input)
│   ├── forms/              # Form-specific components
│   ├── lists/              # List display components
│   └── business/           # Domain-specific components
├── screens/                # Screen components
│   ├── auth/               # Authentication screens
│   ├── inventory/          # Inventory management screens
│   ├── organization/       # Organization management screens
│   └── settings/           # Settings screens
├── navigation/             # React Navigation configuration
├── services/               # API clients & external services
├── store/                  # Zustand state management
├── utils/                  # Utility functions
└── hooks/                  # Custom React hooks
```

### Web Admin (`apps/web-admin/`)
```
src/
├── components/             # React components
├── pages/                  # Route-based page components
├── layouts/                # Layout components
├── hooks/                  # Custom hooks
├── services/               # API services
├── store/                  # State management
└── utils/                  # Utilities
```

### NestJS Services (`services/*/`)
```
src/
├── modules/                # Feature modules
│   ├── [feature]/
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── entities/      # Database entities
│   │   ├── services/      # Business logic
│   │   ├── controllers/   # HTTP controllers
│   │   └── [feature].module.ts
├── common/                 # Shared utilities
│   ├── decorators/        # Custom decorators
│   ├── filters/           # Exception filters
│   ├── guards/            # Authentication guards
│   ├── interceptors/      # Request/response interceptors
│   └── pipes/             # Validation pipes
├── config/                 # Configuration
└── main.ts                # Application entry point
```

## Naming Conventions

### Files & Directories
- **kebab-case** for directories and files: `inventory-service/`, `user-profile.component.ts`
- **PascalCase** for React components: `InventoryList.tsx`, `UserProfile.tsx`
- **camelCase** for functions and variables: `getUserById()`, `inventoryItems`
- **SCREAMING_SNAKE_CASE** for constants: `API_BASE_URL`, `MAX_RETRY_ATTEMPTS`

### Database & API
- **snake_case** for database tables and columns: `inventory_items`, `created_at`
- **camelCase** for API request/response fields: `inventoryItems`, `createdAt`
- **PascalCase** for TypeScript types/interfaces: `InventoryItem`, `UserRole`

### Git Branches
- **Feature branches**: `feature/inventory-search`
- **Bug fixes**: `fix/expiry-date-validation`
- **Releases**: `release/v1.2.0`

## Code Organization Principles

### Layered Architecture
1. **Presentation Layer**: UI components, screens, forms
2. **Application Layer**: Business logic, use cases, services
3. **Domain Layer**: Entities, value objects, domain rules
4. **Infrastructure Layer**: Database, external APIs, file storage

### Dependency Direction
- Higher layers depend on lower layers
- Use dependency injection for loose coupling
- Abstract external dependencies behind interfaces

### Module Boundaries
- Each service is independently deployable
- Shared code goes in `packages/`
- Cross-service communication via tRPC or message queues
- Database per service (microservices pattern)

### Import Organization
```typescript
// 1. Node modules
import React from 'react';
import { z } from 'zod';

// 2. Internal packages
import { InventoryItem } from '@repo/shared-types';
import { Button } from '@repo/ui-components';

// 3. Relative imports
import { useInventory } from '../hooks/useInventory';
import './InventoryList.css';
```

## Testing Structure
- **Unit tests**: `*.test.ts` alongside source files
- **Integration tests**: `tests/integration/` directory
- **E2E tests**: `tests/e2e/` directory
- **Test utilities**: `tools/test-utils/` package

## Configuration Management
- **Environment variables**: `.env` files per environment
- **Type-safe config**: Zod schemas for validation
- **Secrets**: External secret management (Railway/K8s secrets)
- **Feature flags**: Environment-based feature toggles