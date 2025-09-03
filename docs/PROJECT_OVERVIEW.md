# UStudy - Complete Project Overview

## Table of Contents
1. [Project Description](#project-description)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Key Features](#key-features)
5. [Project Structure](#project-structure)
6. [Environment Setup](#environment-setup)
7. [Collections & Data Models](#collections--data-models)
8. [Authentication System](#authentication-system)
9. [Payment Integration](#payment-integration)
10. [Deployment Information](#deployment-information)

## Project Description

UStudy is a comprehensive education platform that serves as a bridge between students and universities worldwide. The platform enables:

- **Students**: Browse courses, register for programs, manage their academic journey
- **Universities**: Showcase their programs, manage student applications, create custom university pages
- **Administrators**: Manage the entire platform, oversee content, handle user management

The platform is built with modern web technologies and follows a headless CMS architecture for maximum flexibility and scalability.

## Technology Stack

### Frontend
- **Next.js 15.3.1** - React framework with App Router
- **React 19.0.0** - Latest React version with advanced features
- **TypeScript 5.7.2** - Type-safe development
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Sass 1.85.1** - CSS preprocessor for custom styling

### Backend & CMS
- **PayloadCMS (Latest)** - Headless Content Management System
- **PostgreSQL** - Primary database
- **Lexical Editor** - Rich text editing capabilities
- **GraphQL** - API query language

### UI Components & Libraries
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **React Slick** - Carousel/slider components
- **React CountUp** - Animated counters
- **FontAwesome** - Icon library

### Payment & Communication
- **Razorpay** - Payment gateway integration
- **SMTP (Gmail)** - Email service
- **React Intl Tel Input** - International phone number input

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Cross-env** - Environment variable management

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   PayloadCMS    │    │   Database      │
│   (Next.js)     │◄──►│   (Headless)    │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Views    │    │   Admin Panel   │    │   File Storage  │
│   - Students    │    │   - Content     │    │   - Media       │
│   - Universities│    │   - Users       │    │   - Documents   │
│   - Public      │    │   - Settings    │    │   - Images      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Architectural Patterns

1. **Headless CMS Architecture**: PayloadCMS provides content management capabilities while Next.js handles the frontend presentation
2. **Role-Based Access Control (RBAC)**: Different user types (students, universities, admins) have specific permissions
3. **Multi-tenant Design**: Universities can have their own branded pages and content
4. **API-First Approach**: RESTful and GraphQL APIs for all data operations
5. **Component-Based UI**: Reusable React components with TypeScript

## Key Features

### Student Features
- User registration and authentication
- Course browsing and search
- University exploration
- Application management
- Dashboard for tracking progress
- Payment processing for courses

### University Features
- University registration and verification
- Custom university page creation
- Course management
- Student application tracking
- Content management dashboard
- Template-based page builder

### Admin Features
- Complete platform oversight
- User management (students, universities)
- Content moderation
- Course approval and management
- Payment transaction monitoring
- Settings and configuration management

### Content Management
- Rich text editing with Lexical
- Block-based content builder
- SEO optimization tools
- Media management
- Template system

## Project Structure

```
ustudy/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (authenticated)/          # Protected routes
│   │   │   └── dashboard/            # User dashboard
│   │   ├── (frontend)/               # Public routes
│   │   │   ├── courses/              # Course pages
│   │   │   ├── universities/         # University pages
│   │   │   ├── login/                # Authentication
│   │   │   └── register/             # Registration
│   │   └── (payload)/                # CMS admin routes
│   │       └── admin/                # PayloadCMS admin panel
│   ├── blocks/                       # Content blocks
│   │   ├── Banner/                   # Hero banners
│   │   ├── Content/                  # Rich content
│   │   ├── CallToAction/             # CTA components
│   │   ├── Form/                     # Form blocks
│   │   └── CoursesComponents/        # Course-specific blocks
│   ├── collections/                  # PayloadCMS collections
│   │   ├── Users/                    # User management
│   │   ├── Students/                 # Student data
│   │   ├── Universities/             # University data
│   │   ├── Courses/                  # Course catalog
│   │   ├── Posts/                    # Blog/news
│   │   ├── Pages/                    # Static pages
│   │   ├── Countries/                # Country data
│   │   └── Settings/                 # App settings
│   ├── components/                   # Reusable UI components
│   │   ├── Header/                   # Navigation
│   │   ├── Footer/                   # Footer
│   │   └── AdminBar/                 # Admin toolbar
│   ├── providers/                    # Context providers
│   │   └── Auth.tsx                  # Authentication context
│   ├── access/                       # Access control
│   └── utilities/                    # Helper functions
├── screenshots/                      # UI screenshots
├── docs/                            # Documentation
├── public/                          # Static assets
└── configuration files
```

## Environment Setup

### Environment Variables
```bash
# Database Configuration
DATABASE_URI=postgres://username:password@host:port/database

# PayloadCMS Configuration  
PAYLOAD_SECRET=your_payload_secret
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
CRON_SECRET=your_cron_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Installation Steps
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate PayloadCMS types
npm run generate:types
```

## Collections & Data Models

### Core Collections

#### Users
- **Purpose**: System administrators and staff
- **Fields**: email, password, role, permissions
- **Access**: Admin only

#### Students  
- **Purpose**: Student user accounts
- **Fields**: name, email, phone, country, courses, payments
- **Access**: Public registration, self-management

#### Universities
- **Purpose**: University accounts and profiles  
- **Fields**: name, email, contact, description, website, template
- **Access**: University registration, self-management

#### Courses
- **Purpose**: Course catalog
- **Fields**: title, description, university, price, content, media
- **Access**: Universities can manage their courses

#### Countries
- **Purpose**: Country data for regional features
- **Fields**: name, code, currency, logo, flag
- **Access**: Admin managed

#### Posts
- **Purpose**: Blog/news content
- **Fields**: title, content, author, categories, SEO
- **Access**: Admin and editor roles

#### Pages
- **Purpose**: Static website pages
- **Fields**: title, content, blocks, SEO metadata
- **Access**: Admin managed

### Relationship Structure
```
Universities ──┐
               ├─→ Courses ──→ Students (enrollments)
               └─→ UniversityPages
               
Countries ──→ Students/Universities (location)

Users ──→ Posts (authorship)
      └─→ Pages (authorship)
```

## Authentication System

### Multi-Type Authentication
- **Students**: Email/password + OTP verification
- **Universities**: Email/password + verification process  
- **Admins**: Email/password with elevated permissions

### Access Control Levels
1. **Public**: Course browsing, university information
2. **Student**: Dashboard, course enrollment, profile management
3. **University**: University dashboard, course management, student applications
4. **Admin**: Full platform access, user management, content approval

### Security Features
- JWT token-based authentication
- OTP verification for phone/email
- Role-based permissions
- Secure password handling
- Session management

## Payment Integration

### Razorpay Integration
- Course payment processing
- Subscription management
- Transaction tracking
- Refund handling
- Multi-currency support

### Payment Flow
1. Student selects course
2. Redirected to secure payment gateway
3. Payment processed via Razorpay
4. Confirmation and enrollment
5. Email notification sent

## Deployment Information

### Production Environment
- **Database**: PostgreSQL hosted on cloud server
- **Application**: Next.js with server-side rendering
- **File Storage**: Integrated with PayloadCMS media handling
- **Email Service**: Gmail SMTP for notifications
- **Payment Gateway**: Razorpay live environment

### Performance Optimizations
- Next.js static generation where possible
- Image optimization and lazy loading
- CSS optimization with Tailwind
- Database indexing for queries
- CDN integration for static assets

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team