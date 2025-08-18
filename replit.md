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
- ✅ Fixed database connection and setup PostgreSQL
- ✅ Implemented comprehensive alerts system with automated monitoring
- ✅ Added gaming stations management in settings with delete functionality
- ✅ Removed manual station adding as per user request
- ✅ Created alert manager with intelligent revenue target monitoring
- ✅ Set up real-time alert notifications in dashboard

## User Preferences
- Keep environment variables simple - user only wants to paste API keys
- Alerts system should be fully functional with automated monitoring
- Focus on practical gaming cafe operations
- Gaming stations: delete functionality in settings, no manual adding
- Prefer database-based station management over UI forms

## Completed Features
- Revenue target monitoring with automated alerts
- Station management with safe deletion (checks for active sessions)
- Real-time dashboard with alert notifications
- Comprehensive settings panel with 5 tabs
- Google Sheets integration framework
- Alert severity levels (info, warning, error)
- Automated alert generation based on time and performance