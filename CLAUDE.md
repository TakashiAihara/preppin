# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-platform inventory management application (Android x iOS) designed to help users efficiently manage household and workplace emergency supplies. The project uses a modern microservices architecture with a hybrid mobile-first design that combines Flutter for mobile apps with React for web administration.

## Project Structure

The project is organized as a Turborepo monorepo with the following structure:

```
preppin/
├── apps/
│   ├── mobile/                 # Flutter + Dart app
│   ├── web-admin/             # React web admin interface
│   ├── admin-bff/             # Hono Admin BFF with tRPC
│   ├── external-api/          # Hono external REST API
│   └── services/              # NestJS microservices
│       ├── auth-service/      # Authentication service
│       ├── inventory-service/ # Inventory management
│       ├── org-service/       # Organization management
│       ├── notify-service/    # Notification handling
│       ├── file-service/      # File/image management
│       └── product-service/   # Product info & barcode
├── packages/
│   ├── shared-types/         # Common TypeScript types
│   ├── trpc-router/          # tRPC router definitions
│   ├── database/            # Prisma schema & migrations
│   ├── ui-components/        # shadcn/ui shared components
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

## Common Development Commands

### Package Management & Development
```bash
# Install dependencies
pnpm install

# Start all development servers
pnpm dev

# Build all packages
pnpm build

# Run all tests
pnpm test

# Run specific test
pnpm test -- path/to/test.spec.ts

# Type checking
pnpm type-check

# Lint and format
pnpm lint
pnpm format
```

### Database Operations
```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Reset database
pnpm db:reset

# Seed database
pnpm db:seed
```

### Mobile Development (Flutter)
```bash
# Install Flutter dependencies
flutter pub get

# Run Flutter app in development
flutter run

# Run on specific device
flutter run -d ios
flutter run -d android

# Build for production
flutter build apk       # Android
flutter build ios       # iOS

# Run Flutter tests
flutter test

# Generate code (for build_runner)
flutter packages pub run build_runner build
```

### Service-specific Commands
```bash
# Run specific service
pnpm --filter @repo/auth-service dev
pnpm --filter @repo/inventory-service dev

# Test specific package
pnpm --filter @repo/shared-types test

# Build specific app
pnpm --filter @repo/mobile build
```

## Key Technologies

- **Mobile**: Flutter + Dart with Riverpod for state management
- **Web Admin**: React + Vite + TypeScript with Zustand + Immer
- **API Layer**: 
  - gRPC for Flutter mobile (high performance binary communication)
  - tRPC for web admin (end-to-end type safety through Hono BFF)
- **Backend**: NestJS microservices with TypeScript + SWC
- **Database**: PostgreSQL + Prisma ORM + Kysely (type-safe queries)
- **Logging & Analytics**: Grafana Stack (Loki + Grafana)
- **Cache**: Valkey (Redis-compatible, open source)
- **Message Queue**: Apache Pulsar
- **Authentication**: Auth.js (NextAuth.js) / Keycloak
- **Build Tools**: 
  - Turborepo for monorepo management
  - TypeScript-Go (tsgo) for 10x faster compilation
  - Biome for linting/formatting
  - lefthook for git hooks
- **Testing**: Vitest for unit tests, Stagehand for E2E tests

## Architecture Overview

### Service Communication Flow
```
Flutter Mobile App ────────gRPC────────► NestJS Microservices
                                                    ↓
Web Admin (React) ──tRPC──► Hono BFF ──gRPC──► NestJS Microservices
                                                    ↓
                                            PostgreSQL + Valkey
```

**Hybrid Architecture Benefits:**
- Flutter uses direct gRPC for optimal mobile performance
- Web admin uses tRPC through BFF for developer experience and browser compatibility

### Key Architectural Decisions

1. **Hybrid Communication Pattern**: 
   - **Flutter Mobile**: Direct gRPC to microservices for optimal performance
   - **Web Admin**: tRPC through Hono BFF for browser compatibility and developer experience

2. **Service Boundaries**: Each microservice owns its data and exposes operations via gRPC:
   - **Auth Service**: User authentication, JWT management
   - **Inventory Service**: Item CRUD, expiry tracking, consumption logs
   - **Organization Service**: Group management, permissions, member invites
   - **Notification Service**: Push notifications via UnifiedPush
   - **File Service**: Image uploads to Railway Storage
   - **Product Service**: Barcode/ASIN lookups

3. **Type Safety Strategy**:
   - **gRPC**: Protocol Buffers for mobile type generation
   - **tRPC**: End-to-end TypeScript type safety for web admin
   - **Prisma + Zod**: Database types with runtime validation
   - **neverthrow**: Functional Result types for error handling

4. **State Management**:
   - **Flutter**: Riverpod for reactive programming and type safety
   - **React**: Zustand + Immer for immutable state updates

5. **Design Patterns**:
   - **Domain Driven Design (DDD)** + **Clean Architecture** for microservices
   - **Repository Pattern** with Prisma ORM
   - **Result Type Pattern** using neverthrow for functional error handling

## Development Guidelines

### Code Organization Principles

1. **File Naming**: 
   - kebab-case for files/directories: `inventory-service/`
   - PascalCase for components: `InventoryList.tsx`
   - camelCase for functions: `getUserById()`

2. **Import Order**:
   ```typescript
   // 1. Node modules
   import React from 'react';
   
   // 2. Internal packages
   import { InventoryItem } from '@repo/shared-types';
   
   // 3. Relative imports
   import { useInventory } from '../hooks/useInventory';
   ```

3. **Testing Strategy**:
   - **Unit tests**: `*.test.ts` alongside source files using Vitest
   - **Integration tests**: `tests/integration/` directory
   - **E2E tests**: `tests/e2e/` using Stagehand
   - **Flutter tests**: `test/` directory using Flutter's testing framework
   - **API Mocking**: MSW (Mock Service Worker) for consistent test data

4. **Platform-specific Guidelines**:
   - **Flutter**: Use Riverpod providers, follow Flutter style guide
   - **React**: Zustand stores in `store/` directory, use Immer for immutable updates
   - **NestJS**: Follow domain-driven design, use decorators consistently
   - **Database**: Use Prisma migrations, prefer Kysely for complex queries

## Key Features

1. **Inventory Management**: Track items with expiry dates, quantities, and locations
2. **Dual Date Management**: Separate tracking for expiry dates and best-before dates
3. **Organization Support**: Multi-user family/group management with role-based permissions
4. **Barcode Scanning**: JAN code and ASIN integration for product information
5. **Offline Capability**: Full offline support with background sync
6. **Analytics**: Consumption tracking and predictive analytics
7. **Multi-platform**: Native mobile apps and web admin interface

## Implementation Status

The project is currently in the specification phase. The implementation plan is detailed in `.kiro/specs/inventory-management/tasks.md` with a phased approach:

- Phase 1: Foundation (project setup, type definitions, database design)
- Phase 2: Core Services (auth, organization, inventory management)
- Phase 3: UI/UX (mobile app, web admin, shared components)
- Phase 4: Quality & Operations (testing, deployment, infrastructure)

## Security Considerations

- HTTPS/TLS 1.3 enforced for all communications
- JWT token rotation with short-lived access tokens
- Data classification and encryption for sensitive information
- Comprehensive audit logging for compliance
- GDPR/privacy law compliance with data retention policies

## Infrastructure & Deployment

- **Development**: Railway for rapid prototyping and development
- **Production**: Kubernetes with Pulumi Infrastructure as Code
- **Monitoring**: Jaeger + Prometheus for APM, Grafana Stack for logs and analytics
- **Storage**: Railway Storage for file uploads
- **Caching**: Valkey for session and application data caching

## Performance Optimization

- **Mobile**: Flutter's native compilation for 60fps performance
- **Web**: Vite for fast development builds and optimized production bundles
- **Database**: PostgreSQL indexing with Kysely for complex queries
- **Caching**: Valkey for frequently accessed data
- **Images**: WebP format optimization with Railway Storage CDN
- **Offline**: Background sync for mobile offline capability