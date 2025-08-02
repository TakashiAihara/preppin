# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-platform inventory management application (Android x iOS) designed to help users efficiently manage household and workplace emergency supplies. The project uses a modern microservices architecture with a TypeScript-based tech stack.

## Project Structure

The project is organized as a Turborepo monorepo with the following planned structure:

```
preppin/
├── apps/
│   ├── mobile/                 # React Native app (Expo)
│   ├── web-admin/             # React admin dashboard
│   ├── bff/                   # Hono BFF with tRPC
│   └── services/              # NestJS microservices
├── packages/
│   ├── shared-types/          # Shared TypeScript types
│   ├── trpc-router/          # tRPC router definitions
│   ├── database/             # Prisma schema and migrations
│   └── ui-components/        # Shared UI components
└── tools/                     # Build tools and configs
```

## Key Technologies

- **Frontend**: React Native (Expo) for mobile, React + Vite for web admin
- **API Layer**: tRPC for type-safe API communication, Hono for BFF
- **Backend**: NestJS microservices architecture
- **Database**: PostgreSQL (main), MongoDB (logs/analytics), Valkey (cache)
- **Authentication**: Auth.js/Keycloak integration
- **Type Safety**: TypeScript throughout, Zod for validation, Prisma for ORM
- **Testing**: Vitest, MSW for mocking, Stagehand for E2E
- **Deployment**: Initially Railway, then Kubernetes with Pulumi IaC

## Architecture Principles

1. **Type Safety First**: End-to-end type safety with tRPC, Prisma, and Zod
2. **Microservices**: Separate services for auth, inventory, organizations, notifications
3. **API Gateway Pattern**: BFF handles client communication, services communicate via tRPC
4. **Offline Support**: Mobile app works offline with local SQLite and sync capabilities
5. **Security**: JWT authentication, role-based access control, data encryption

## Development Guidelines

1. **Error Handling**: Use neverthrow Result types for error handling
2. **Validation**: Zod schemas for all data validation
3. **State Management**: Zustand + Immer for client state
4. **UI Components**: shadcn/ui with TailwindCSS
5. **Testing**: Test-driven development approach

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

## Performance Optimization

- Image optimization with WebP format and CDN delivery
- Database indexing for search performance
- Redis caching for frequently accessed data
- Virtual scrolling for large lists
- Background sync for offline data