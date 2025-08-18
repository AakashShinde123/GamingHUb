# Patil's Gaming Cafe Management System

## Project Overview
A comprehensive gaming cafe management system with revenue tracking, customer management, and automated alerts. Built with React frontend, Express backend, and PostgreSQL database.

## Project Architecture
- **Frontend**: React with TypeScript, Wouter for routing, TanStack Query for data fetching
- **Backend**: Express.js with TypeScript, RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Real-time Features**: Alerts system for revenue targets and cafe management

## Key Features
- Customer management (registration, phone lookup)
- Gaming station management (PC/Console types, hourly rates)
- Session tracking (active sessions, duration, billing)
- Revenue tracking with targets (daily, weekly, monthly)
- Automated alerts system
- Dashboard with metrics and analytics
- Google Sheets integration for reporting

## Database Schema
- `customers`: Customer information and contact details
- `gaming_stations`: Station details, types, and rates
- `sessions`: Gaming session tracking with billing
- `revenue_targets`: Target setting and tracking
- `alerts`: Notification system for important events
- `activities`: Activity log for audit trail

## Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (auto-provided by Replit)
- `GOOGLE_SHEETS_CREDENTIALS`: For Google Sheets integration (optional)

## Recent Changes
- Initial project setup with full stack architecture
- Database schema implementation with Drizzle ORM
- Basic CRUD operations for all entities
- Dashboard with metrics visualization

## User Preferences
- Keep environment variables simple - user only wants to paste API keys
- Alerts system should be fully functional
- Focus on practical gaming cafe operations

## Known Issues
- Database connection error on startup - needs environment setup
- Alerts system implementation may need completion