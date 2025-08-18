# Gaming Cafe Revenue Dashboard

## Overview

This is a comprehensive revenue management dashboard for Patil's Gaming Cafe. The application provides real-time monitoring of gaming station utilization, customer check-ins/check-outs, revenue tracking against targets, and activity monitoring. It's built as a full-stack web application with a React frontend and Express backend, designed to help gaming cafe operators optimize their business performance through data-driven insights.

The system tracks active gaming sessions, manages customer information, monitors station availability, and provides revenue analytics with customizable targets. It includes automated alerting for revenue thresholds and provides visual dashboards for quick business insights.

**Recent Major Updates (January 2025):**
- ✅ Migrated from memory storage to PostgreSQL database for persistent data storage
- ✅ Implemented comprehensive DatabaseStorage class with full CRUD operations
- ✅ Added Google Sheets integration for daily data export with automatic scheduling
- ✅ Enhanced settings dialog with Google Sheets export functionality
- ✅ Successfully deployed database schema with 25 gaming stations and revenue targets
- ✅ All API endpoints working with real database data
- ✅ Gaming aesthetics enhanced with improved visual styling

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **UI Components**: Shadcn/UI component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens for consistent theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management, caching, and real-time data synchronization
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features and type safety
- **Database Integration**: Drizzle ORM for type-safe database operations and schema management
- **Session Management**: Express sessions with PostgreSQL session store for persistent user sessions
- **API Design**: RESTful endpoints with consistent error handling and response formatting

### Data Storage Solutions
- **Database**: PostgreSQL as the primary database for reliable data persistence
- **Connection**: Neon Database serverless PostgreSQL for cloud-hosted database infrastructure
- **Schema Management**: Drizzle Kit for database migrations and schema versioning
- **Data Validation**: Zod schemas for runtime type validation and API request/response validation

### Key Data Models
- **Customers**: Customer information with phone-based lookup for quick check-ins
- **Gaming Stations**: Station management with hourly rates, types (PC/Console), and availability status
- **Sessions**: Active and historical gaming sessions with time tracking and billing
- **Revenue Targets**: Configurable daily, weekly, and monthly revenue goals
- **Alerts**: System notifications for revenue thresholds and operational events
- **Activities**: Audit trail for all system actions and customer interactions

### Real-time Features
- **Live Dashboard Updates**: 30-second polling intervals for metrics, utilization, and active sessions
- **Automatic Session Tracking**: Real-time monitoring of gaming session durations and billing
- **Alert System**: Automated notifications when revenue targets are missed or thresholds are reached
- **Activity Logging**: Real-time tracking of all customer check-ins, check-outs, and system events

### UI/UX Design Patterns
- **Component Architecture**: Modular, reusable components with consistent prop interfaces
- **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
- **Loading States**: Skeleton loaders and loading indicators for better user experience
- **Error Handling**: Toast notifications and error boundaries for graceful error management
- **Gaming Theme**: Custom color scheme with gaming-inspired gradients and visual elements

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling and backup management
- **Drizzle ORM**: Type-safe database toolkit for schema management, migrations, and queries

### UI/Component Libraries
- **Radix UI**: Headless, accessible component primitives for complex UI elements
- **Shadcn/UI**: Pre-built component library with consistent design system
- **Lucide React**: Comprehensive icon library with consistent styling
- **Recharts**: Data visualization library for revenue charts and analytics

### Development Tools
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **React Hook Form**: Form state management with validation and error handling
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Utility for managing component variants and conditional styling

### Build and Development
- **Vite**: Build tool with hot module replacement and optimized bundling
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Validation and Type Safety
- **Zod**: Runtime type validation for API endpoints and form data
- **Drizzle Zod**: Integration between Drizzle schemas and Zod validation
- **TypeScript**: Compile-time type checking across the entire application stack