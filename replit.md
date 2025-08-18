# PlayHub Management System

## Overview

A full-stack gaming center management application built with React frontend and Express backend for PlayHub. The system provides real-time monitoring of gaming sessions, revenue tracking, station utilization, and alert management. Features include customer check-in/check-out, revenue target tracking, automated alerts, Google Sheets integration, and comprehensive dashboard analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom gaming-themed color palette and responsive design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts library for data visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript in ESM module format
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Custom session tracking with real-time updates
- **Alert System**: Automated alert manager with configurable thresholds
- **API Structure**: RESTful endpoints for CRUD operations on customers, stations, sessions, targets, and alerts

### Database Design
- **Core Entities**: Customers, Gaming Stations, Sessions, Revenue Targets, Alerts, Activities
- **Session Tracking**: Active session monitoring with start/end times and billing calculations
- **Revenue Management**: Hierarchical target tracking (daily/weekly/monthly) with progress monitoring
- **Activity Logging**: Comprehensive audit trail for all system actions

### Real-time Features
- **Live Dashboard**: Auto-refreshing metrics every 30 seconds
- **Session Monitoring**: Real-time station occupancy and customer activity
- **Alert System**: Automated revenue threshold monitoring with severity levels
- **Activity Feed**: Live updates of check-ins, check-outs, and system events

### Data Management
- **Revenue Calculations**: Automated billing based on session duration and station hourly rates
- **Target Tracking**: Progressive revenue monitoring against configurable daily/weekly/monthly goals
- **Utilization Analytics**: Real-time station occupancy rates and usage patterns
- **Historical Reporting**: Session history and revenue trends with chart visualizations

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database with connection pooling
- **Drizzle Kit**: Database migration and schema management tool

### Third-party Integrations
- **Google Sheets API**: Optional daily data export functionality
- **Google Fonts**: Roboto font family for consistent typography

### UI and Styling
- **Radix UI**: Accessible component primitives for dialogs, dropdowns, and form controls
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Icon library for consistent iconography
- **Recharts**: Chart library for revenue trends and utilization visualization

### Development Tools
- **Replit Integration**: Development environment with hot reloading and error overlay
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins