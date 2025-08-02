# Technology Stack & Build System

## Architecture
**Microservices architecture** with BFF (Backend for Frontend) pattern using TypeScript across the entire stack.

## Frontend Technologies
- **Mobile**: React Native + Expo SDK + TypeScript
- **Web Admin**: React + Vite + React Router + React Query + TypeScript
- **UI Framework**: TailwindCSS + shadcn/ui components
- **State Management**: Zustand + Immer for immutable updates
- **Testing**: MSW (Mock Service Worker) for API mocking

## Backend Technologies
- **BFF Layer**: Hono (lightweight, fast, Edge Runtime compatible)
- **Microservices**: NestJS + TypeScript + SWC (fast compilation)
- **API Protocol**: tRPC for end-to-end type safety
- **Authentication**: Auth.js (NextAuth.js) / Keycloak for enterprise
- **Message Queue**: Apache Pulsar for inter-service communication

## Database & Storage
- **Primary DB**: PostgreSQL + Prisma ORM + Kysely (type-safe queries)
- **Analytics/Logs**: MongoDB for flexible schema data
- **Cache**: Valkey (Redis-compatible, open source)
- **File Storage**: MinIO/AWS S3 for images and documents

## Development Tools
- **Monorepo**: Turborepo for efficient builds and caching
- **TypeScript Compiler**: TypeScript-Go (tsgo) - 10x faster than tsc
- **Linting/Formatting**: Biome (Rust-based, unified tooling)
- **Git Hooks**: lefthook for quality gates
- **Error Handling**: neverthrow for functional Result types
- **Validation**: Zod + zod-prisma-types for runtime type checking

## Infrastructure
- **Initial Deployment**: Railway for rapid prototyping
- **Production**: Kubernetes (GKE) with Pulumi IaC
- **GitOps**: ArgoCD for deployment automation
- **Monitoring**: Prometheus + Grafana

## Common Commands

### Development
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Type checking
pnpm type-check

# Lint and format
pnpm lint
pnpm format
```

### Database
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

### Mobile Development
```bash
# Start Expo development server
pnpm mobile:start

# Run on iOS simulator
pnpm mobile:ios

# Run on Android emulator
pnpm mobile:android

# Build for production
pnpm mobile:build
```

## Key Principles
- **Type Safety First**: End-to-end TypeScript with runtime validation
- **Performance**: Fast builds with tsgo, efficient caching with Turborepo
- **Developer Experience**: Hot reload, auto-completion, integrated tooling
- **Quality Gates**: Automated testing, linting, and formatting on commit