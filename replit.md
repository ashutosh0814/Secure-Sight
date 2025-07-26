# SecureSight CCTV Monitoring Dashboard

## Overview

SecureSight is a comprehensive CCTV monitoring software dashboard built as a full-stack web application. The system allows users to monitor security incidents across multiple camera feeds, with features for incident tracking, resolution management, and real-time dashboard visualization. This implementation focuses on the dashboard interface with incident management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Custom design system with dark theme support and specialized CCTV monitoring UI

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with JSON responses
- **Request Handling**: Express middleware for JSON parsing and logging
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations with schema-first approach
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Data Models
- **Camera**: Represents CCTV camera entities with id, name, and location
- **Incident**: Security incidents with camera association, type classification, timestamps, thumbnails, and resolution status
- **User**: User management with authentication capabilities (placeholder implementation)

### Frontend Components
- **Dashboard Layout**: Three-panel layout with navbar, incident player, and incident list
- **Incident Player**: Main video display area with camera thumbnails
- **Incident List**: Scrollable list of incidents with resolution capabilities
- **Timeline**: Optional bottom panel showing incident timeline across cameras
- **Navbar**: Navigation with branding and user profile

### API Endpoints
- `GET /api/incidents?resolved=false` - Fetch incidents with optional filtering
- `PATCH /api/incidents/:id/resolve` - Toggle incident resolution status
- `GET /api/cameras` - Retrieve all camera information

## Data Flow

1. **Incident Loading**: Dashboard loads unresolved incidents on mount using React Query
2. **Real-time Updates**: Query invalidation ensures fresh data after mutations
3. **Optimistic Updates**: UI updates immediately before server confirmation
4. **Error Handling**: Toast notifications for user feedback on operations
5. **State Synchronization**: Automatic cache updates maintain consistency

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **date-fns**: Date formatting and manipulation

### State and Data Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation and type inference

### Development Tools
- **TypeScript**: Type safety across the entire application
- **Vite**: Fast development server and build tool
- **ESBuild**: Fast JavaScript/TypeScript bundler for production

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Error Overlay**: Runtime error modal for development debugging
- **File Watching**: Automatic recompilation on source changes

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle push command for schema deployment
- **Environment**: NODE_ENV-based configuration switching

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with client, server, and shared code
   - **Problem**: Code sharing between frontend and backend
   - **Solution**: Shared schema definitions and types in `/shared` directory
   - **Benefits**: Type safety, reduced duplication, easier maintenance

2. **Database ORM Choice**: Drizzle ORM over Prisma
   - **Problem**: Need for type-safe database operations
   - **Solution**: Drizzle with PostgreSQL for serverless compatibility
   - **Benefits**: Better TypeScript integration, smaller bundle size

3. **State Management**: TanStack Query over Redux
   - **Problem**: Server state synchronization and caching
   - **Solution**: React Query for automatic caching and background updates
   - **Benefits**: Less boilerplate, built-in loading states, automatic refetching

4. **UI Component Strategy**: shadcn/ui over Material-UI
   - **Problem**: Customizable, accessible components
   - **Solution**: Radix primitives with Tailwind styling
   - **Benefits**: Full design control, better performance, smaller bundle

5. **Build Tool Selection**: Vite over Create React App
   - **Problem**: Fast development experience
   - **Solution**: Vite with native ESM support
   - **Benefits**: Faster startup, better development experience, optimized builds