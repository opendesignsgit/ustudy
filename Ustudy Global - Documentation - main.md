# 🎓 Ustudy Global - Comprehensive Documentation

![Ustudy Logo](./public/ustudy-logo.png "Ustudy Global Education Platform Logo")

**Version:** 1.0.0  
**Last Updated:** December 2024  
**Platform:** Next.js 15 + Payload CMS

---

## 📋 Table of Contents

### 🚀 [Quick Start Guides](#quick-start-guides)
- [For Students](#quick-start-for-students)
- [For Universities](#quick-start-for-universities) 
- [For Developers](#quick-start-for-developers)
- [For Administrators](#quick-start-for-administrators)

### 🎯 [Platform Overview](#platform-overview)
- [What is Ustudy Global](#what-is-ustudy-global)
- [Key Features](#key-features)
- [Target Audiences](#target-audiences)
- [System Architecture](#system-architecture)

### 👥 [User Guides](#user-guides)
- [Student Experience](#student-experience)
- [University Management](#university-management)
- [Administrator Functions](#administrator-functions)

### 🏗️ [Technical Documentation](#technical-documentation)
- [Development Setup](#development-setup)
- [Architecture Details](#architecture-details)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Authentication & Security](#authentication--security)

### 🎨 [Template System](#template-system)
- [University Templates](#university-templates)
- [Block Components](#block-components)
- [Customization Guide](#customization-guide)

### ⚙️ [Configuration & Deployment](#configuration--deployment)
- [Environment Setup](#environment-setup)
- [Production Deployment](#production-deployment)
- [Hosting Options](#hosting-options)

### 🧪 [Testing](#testing)
- [Testing Strategy](#testing-strategy)
- [Manual Testing Guide](#manual-testing-guide)
- [Automated Testing](#automated-testing)

### 🔧 [Troubleshooting](#troubleshooting)
- [Common Issues](#common-issues)
- [Error Resolution](#error-resolution)
- [Support Resources](#support-resources)

---

## 🚀 Quick Start Guides

### Quick Start for Students

**Goal:** Register, browse courses, and manage your learning journey.

1. **Registration**
   - Visit the platform homepage
   - Click "Sign Up" in the top navigation
   - Select "Student" user type
   - Fill in your details (name, email, phone)
   - Verify your account via OTP
   - Complete your profile setup

2. **Course Discovery**
   - Browse available courses by category
   - Use filters: study area, degree program, location
   - View detailed course information
   - Check university profiles and offerings

3. **Account Management**
   - Access your dashboard at `/dashboard`
   - Update personal information
   - Track course interests and applications
   - Manage account settings

**Next Steps:** [Complete Student Experience Guide](#student-experience)

### Quick Start for Universities

**Goal:** Register your institution, create your profile, and manage your online presence.

1. **University Registration**
   - Navigate to registration page
   - Select "University" user type from dropdown
   - Provide institutional details:
     - University name
     - Official email address
     - Phone number
     - Website URL
     - Description
   - Choose from 4 pre-built templates:
     - Modern University (contemporary design)
     - Classic University (traditional layout)
     - Tech University (cutting-edge design)
     - Liberal Arts (creative, artistic design)
   - Submit registration and verify account

2. **Dashboard Access**
   - Login with your credentials
   - Access unified dashboard at `/dashboard`
   - Four main management tabs:
     - **Account Details**: Edit university information
     - **Content Editor**: Manage your content (via CMS link)
     - **View University Page**: Preview your public page
     - **Manage Pages**: Create and manage sub-pages

3. **Page Management**
   - Create university sub-pages (About Us, Admissions, etc.)
   - Access via `/university/[slug]` URLs
   - Use rich text editor for content creation
   - Organize pages with menu ordering system

**Next Steps:** [Complete University Management Guide](#university-management)

### Quick Start for Developers

**Goal:** Set up development environment and understand the codebase.

1. **Prerequisites**
   - Node.js 18.20.2+ or 20.9.0+
   - npm or pnpm package manager
   - PostgreSQL database (optional for development)

2. **Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/opendesignsgit/ustudy.git
   cd ustudy
   
   # Install dependencies
   npm install
   # or
   pnpm install
   
   # Copy environment variables
   cp .env.example .env
   
   # Start development server
   npm run dev
   # or
   pnpm dev
   ```

3. **Development Environment**
   - Application runs on `http://localhost:3000`
   - Admin panel accessible at `/admin`
   - Hot reload enabled for all changes
   - TypeScript support with full type safety

4. **Key Directories**
   ```
   src/
   ├── app/                 # Next.js App Router
   ├── collections/         # Payload CMS collections
   ├── components/          # Reusable React components
   ├── blocks/              # Content building blocks
   └── payload.config.ts    # Payload CMS configuration
   ```

**Next Steps:** [Complete Technical Documentation](#technical-documentation)

### Quick Start for Administrators

**Goal:** Configure system settings and manage users across the platform.

1. **Admin Panel Access**
   - Navigate to `/admin`
   - Login with admin credentials
   - Access comprehensive admin dashboard

2. **User Management**
   - **Users Collection**: Manage all platform users
   - **Role Assignment**: Assign roles (admin, university-role, editor, post-editor)
   - **University Association**: Link users to institutions
   - **Permission Control**: Configure access levels

3. **System Configuration**
   - **RoleSettings**: Configure role-based permissions
   - **Website Settings**: Platform-wide configurations
   - **University Templates**: Manage design templates
   - **Course Categories**: Organize educational content

4. **Content Oversight**
   - **Universities**: Approve and manage institution profiles
   - **Courses**: Oversee educational offerings
   - **Posts**: Manage blog and news content
   - **Pages**: Control static page content

**Next Steps:** [Complete Administrator Functions Guide](#administrator-functions)

---

## 🎯 Platform Overview

### What is Ustudy Global

Ustudy Global is a comprehensive education management platform that connects students with universities worldwide. Built on modern web technologies (Next.js 15 and Payload CMS), it provides a robust, scalable solution for educational institutions to showcase their offerings and for students to discover learning opportunities.

**Core Mission:** Simplifying the connection between students and educational institutions through technology.

### Key Features

#### 🎓 **For Students**
- **Course Discovery**: Advanced search and filtering system
- **University Profiles**: Detailed institutional information
- **Application Tracking**: Manage your educational journey
- **User Dashboard**: Personalized learning experience
- **Mobile Responsive**: Access anywhere, anytime

#### 🏛️ **For Universities**
- **Professional Templates**: 4 pre-designed university templates
- **Custom Pages**: Create unlimited sub-pages
- **Content Management**: Rich text editing capabilities
- **Public Profiles**: SEO-optimized university pages
- **Analytics Ready**: Track page performance

#### 👨‍💼 **For Administrators**
- **Role-Based Access**: Granular permission system
- **Content Moderation**: Approve and manage all content
- **User Management**: Complete user lifecycle control
- **System Configuration**: Platform-wide settings
- **Security Controls**: Advanced access management

#### 🔧 **Technical Features**
- **Modern Stack**: Next.js 15, Payload CMS, TypeScript
- **Database Agnostic**: PostgreSQL support with migration system
- **SEO Optimized**: Built-in SEO tools and structured data
- **Performance**: Server-side rendering and caching
- **Scalable**: Cloud-ready architecture

### Target Audiences

#### 1. **Students** 🎓
*Primary users seeking educational opportunities*

**Needs:**
- Course and university discovery
- Application management
- Information access
- Career guidance

**Features:**
- Advanced search functionality
- Detailed university profiles
- Application tracking system
- Personal dashboard

#### 2. **Universities** 🏛️
*Educational institutions showcasing their offerings*

**Needs:**
- Professional online presence
- Student recruitment tools
- Content management
- Brand representation

**Features:**
- Template-based website creation
- Custom page management
- Rich content editing
- SEO optimization

#### 3. **Developers** 💻
*Technical team maintaining and extending the platform*

**Needs:**
- Clean, maintainable codebase
- Comprehensive documentation
- Development tools
- API access

**Features:**
- TypeScript implementation
- Component-based architecture
- API documentation
- Development environment

#### 4. **Administrators** ⚙️
*Platform managers ensuring smooth operations*

**Needs:**
- User management tools
- Content oversight
- System configuration
- Analytics and reporting

**Features:**
- Admin panel interface
- Role-based permissions
- Content moderation tools
- System settings management

### System Architecture

#### **Technology Stack**

```
Frontend (Next.js 15)
├── React 19.0.0
├── TypeScript 5.7.2
├── Tailwind CSS 3.4.17
└── Lexical Editor

Backend (Payload CMS)
├── Payload Latest
├── PostgreSQL Adapter
├── Authentication System
└── File Upload Management

Infrastructure
├── Next.js App Router
├── Server-Side Rendering
├── API Routes
└── Static Generation
```

#### **Architecture Patterns**

- **Headless CMS**: Payload CMS provides backend functionality
- **JAMstack**: JavaScript, APIs, and Markup for performance
- **Component-Based**: Reusable React components
- **Block System**: Modular content building blocks
- **Responsive Design**: Mobile-first approach

#### **Data Flow**

```
User Request → Next.js Router → Payload API → Database → Response
                     ↓
            Component Rendering → Client Interface
```

---

## 👥 User Guides

### Student Experience

#### Registration Process

1. **Account Creation**
   - Navigate to the registration page
   - Select "Student" from user type options
   - Required information:
     - Full name
     - Email address (must be unique)
     - Phone number with country code
     - Password (minimum 8 characters)
   - Optional profile details
   - Account verification via email/SMS OTP

2. **Profile Setup**
   - Complete educational background
   - Set learning preferences
   - Upload profile photo (optional)
   - Academic interests and goals

#### Course Discovery

**Advanced Search Features:**
- **Study Areas**: Computer Science, Engineering, Business, Medicine, Arts
- **Degree Programs**: Bachelor's, Master's, PhD, Certificate
- **Study Modes**: Full-time, Part-time, Online, Hybrid
- **Location Filters**: Country, city, region
- **Intake Periods**: Fall, Spring, Summer admissions

**University Profiles:**
- Institutional overview and history
- Campus facilities and photos
- Faculty information
- Student testimonials
- Admission requirements
- Tuition and financial aid

#### Dashboard Features

**Account Management:**
- Personal information updates
- Contact details management
- Password and security settings
- Privacy preferences

**Learning Journey:**
- Saved courses and programs
- Application status tracking
- Communication history
- Document uploads

**Resources:**
- Study guides and materials
- University comparison tools
- Application deadlines calendar
- Career guidance resources

### University Management

#### Registration and Setup

**Institutional Registration:**
1. **Basic Information**
   - Official university name
   - Institutional email address
   - Primary contact phone number
   - Official website URL
   - Institutional description (500-1000 words)

2. **Template Selection**
   Choose from professionally designed templates:
   
   - **Modern University**: Clean, contemporary design with focus on innovation
   - **Classic University**: Traditional, elegant layout emphasizing heritage
   - **Tech University**: Cutting-edge design for technology-focused institutions
   - **Liberal Arts**: Creative, artistic design for arts and humanities

3. **Verification Process**
   - Email verification required
   - Administrative review (24-48 hours)
   - Account activation notification

#### Dashboard Management

**Four-Tab Interface:**

1. **Account Details Tab**
   - Edit university basic information
   - Update contact details
   - Modify description and overview
   - Change institutional branding
   - Save functionality with real-time validation

2. **Content Editor Tab**
   - Link to Payload CMS admin panel
   - Rich text editing capabilities
   - Media upload and management
   - Content version control
   - Preview functionality

3. **View University Page Tab**
   - Direct link to public university page
   - Preview mode for content changes
   - URL display for sharing
   - SEO preview and optimization

4. **Manage Pages Tab** (Enhanced Feature)
   - Create unlimited sub-pages
   - Page management interface:
     - Title and description editing
     - SEO settings configuration
     - Menu visibility controls
     - Page ordering system
   - Rich content editing via CMS
   - Real-time page management

#### Public Page Features

**Automatic Page Generation:**
- SEO-friendly URLs: `/university/[university-slug]`
- Responsive design across all devices
- Fast loading with optimized images
- Search engine optimization built-in

**Content Sections:**
- Hero section with customizable layouts
- About section with institutional information
- Programs showcase (grid, list, or carousel)
- Contact information and forms
- Custom content blocks

**Sub-Page System:**
- Create pages like: `/university/about-us`, `/university/admissions`
- Full content management via CMS
- Menu integration with ordering
- Draft and publish workflow

### Administrator Functions

#### User Management System

**Users Collection Management:**
- View all registered users (students and universities)
- Role assignment and modification
- Account status management (active, suspended, pending)
- Bulk operations for user management
- User activity monitoring

**Role-Based Access Control:**

| Role | Permissions | Description |
|------|-------------|-------------|
| **admin** | Full system access | Complete platform control, user management, system configuration |
| **university-role** | Own university only | Manage own institution, create sub-pages, content editing |
| **editor** | Content management | Blog posts, news articles, general content creation |
| **post-editor** | Limited posting | Restricted content creation and editing capabilities |

#### Content Oversight

**University Approval Process:**
1. University registration submission
2. Administrative review of credentials
3. Verification of institutional legitimacy
4. Account approval and activation
5. Ongoing monitoring and support

**Content Moderation:**
- Review and approve university profiles
- Monitor user-generated content
- Ensure compliance with platform guidelines
- Handle content disputes and violations

#### System Configuration

**RoleSettings Management:**
- Configure permissions for each role
- Set access levels for collections
- Define workflow restrictions
- Customize admin panel visibility

**Platform Settings:**
- Website-wide configuration options
- SEO settings and meta tags
- Email notification templates
- System maintenance modes

#### Analytics and Reporting

**User Analytics:**
- Registration trends and statistics
- User engagement metrics
- Geographic distribution
- Platform usage patterns

**Content Performance:**
- Popular universities and courses
- Search query analytics
- Page view statistics
- Conversion tracking

---

## 🏗️ Technical Documentation

### Development Setup

#### Prerequisites

**System Requirements:**
- **Node.js**: Version 18.20.2 or higher, or 20.9.0+
- **Package Manager**: npm (included with Node.js) or pnpm (recommended)
- **Database**: PostgreSQL 12+ (for production) or SQLite (for development)
- **Git**: Version control system

**Recommended Development Tools:**
- **VS Code**: With TypeScript, Prettier, and ESLint extensions
- **Postman**: API testing and development
- **Browser**: Chrome or Firefox with React Developer Tools

#### Installation Guide

1. **Clone Repository**
   ```bash
   git clone https://github.com/opendesignsgit/ustudy.git
   cd ustudy
   ```

2. **Install Dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using pnpm (recommended for faster installs)
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env file with your configuration
   # Required variables:
   # PAYLOAD_SECRET=your-secret-key
   # DATABASE_URI=your-database-connection-string
   # PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # For PostgreSQL (production)
   # Create database and run migrations
   npm run payload migrate
   
   # For SQLite (development)
   # Database file will be created automatically
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Access Application**
   - **Frontend**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin
   - **API**: http://localhost:3000/api

#### Development Workflow

**File Structure Overview:**
```
src/
├── app/                          # Next.js App Router
│   ├── (authenticated)/          # Protected routes
│   ├── (frontend)/               # Public pages
│   └── (payload)/                # Admin panel routes
├── blocks/                       # Content building blocks
│   └── UniversityTemplateBlocks/ # University-specific blocks
├── collections/                  # Payload CMS collections
│   ├── Users/                    # User management
│   ├── Universities/             # University profiles
│   ├── Courses/                  # Course catalog
│   └── UniversityPages/          # University sub-pages
├── components/                   # Reusable React components
├── providers/                    # Context providers (Auth, etc.)
└── payload.config.ts             # Payload CMS configuration
```

**Key Development Commands:**
```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix           # Fix ESLint issues
npm run format             # Format code with Prettier

# Database
npm run payload migrate    # Run database migrations
npm run payload seed       # Seed database with sample data

# Type Generation
npm run generate:types     # Generate TypeScript types from Payload schema
```

### Architecture Details

#### Application Architecture

**Layered Architecture:**
```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│  (React Components, Next.js Pages)  │
├─────────────────────────────────────┤
│           Business Logic Layer      │
│    (API Routes, Payload Hooks)      │
├─────────────────────────────────────┤
│            Data Access Layer        │
│     (Payload Collections, ORM)      │
├─────────────────────────────────────┤
│           Database Layer            │
│        (PostgreSQL/SQLite)          │
└─────────────────────────────────────┘
```

#### Authentication System

**Multi-User Type Authentication:**
- **Users Collection**: Handles students and administrators
- **Universities Collection**: Manages institutional accounts
- **JWT-Based**: Secure token authentication
- **Role-Based Access**: Granular permission system

**Authentication Flow:**
```
User Login → Credential Validation → JWT Generation → Session Creation → Dashboard Access
```

**Security Features:**
- Password hashing with bcrypt
- JWT token expiration
- Role-based route protection
- CSRF protection
- Input validation and sanitization

#### Content Management System

**Payload CMS Integration:**
- **Headless Architecture**: API-first content management
- **Block-Based Content**: Modular content creation
- **Rich Text Editor**: Lexical editor integration
- **Media Management**: Image upload and optimization
- **Version Control**: Draft and publish workflow

**Collection Schema:**
```typescript
// Example: University Collection
{
  slug: 'universities',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', unique: true },
    { name: 'description', type: 'richText' },
    { name: 'template', type: 'select', options: [...] },
    { name: 'content', type: 'blocks', blocks: [...] }
  ]
}
```

### API Reference

#### Authentication Endpoints

**User Authentication:**
```typescript
POST /api/users/login
{
  email: string,
  password: string,
  userType?: 'student' | 'university'
}

POST /api/users/logout
// Clears authentication session

GET /api/users/me
// Returns current user information
```

**University Authentication:**
```typescript
POST /api/universities/register
{
  name: string,
  email: string,
  phone: string,
  website?: string,
  description: string,
  template: 'modern' | 'classic' | 'tech' | 'liberal-arts'
}
```

#### Content Management Endpoints

**University Management:**
```typescript
GET /api/universities
// Get all universities (public data only)

GET /api/universities/[slug]
// Get specific university details

PUT /api/universities/[id]
// Update university information (authenticated)

DELETE /api/universities/[id]
// Delete university (admin only)
```

**University Pages:**
```typescript
GET /api/university-pages
// Get university sub-pages

POST /api/university-pages
// Create new university page

PUT /api/university-pages/[id]
// Update university page

DELETE /api/university-pages/[id]
// Delete university page
```

#### Course Management Endpoints

```typescript
GET /api/courses
// Get all courses with filtering options
// Query parameters: area, program, mode, location

GET /api/courses/[id]
// Get specific course details

POST /api/courses
// Create new course (university/admin only)

PUT /api/courses/[id]
// Update course information

DELETE /api/courses/[id]
// Delete course (admin only)
```

### Database Schema

#### Core Collections

**Users Collection:**
```sql
users {
  id: uuid PRIMARY KEY,
  email: varchar UNIQUE,
  password: varchar,
  role: enum('admin', 'university-role', 'editor', 'post-editor'),
  firstName: varchar,
  lastName: varchar,
  phone: varchar,
  university: uuid REFERENCES universities(id),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Universities Collection:**
```sql
universities {
  id: uuid PRIMARY KEY,
  name: varchar,
  slug: varchar UNIQUE,
  email: varchar UNIQUE,
  phone: varchar,
  website: varchar,
  description: text,
  template: varchar,
  logo: uuid REFERENCES media(id),
  content: jsonb,
  _status: enum('draft', 'published'),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**University Pages Collection:**
```sql
university_pages {
  id: uuid PRIMARY KEY,
  title: varchar,
  slug: varchar,
  description: text,
  content: jsonb,
  university: uuid REFERENCES universities(id),
  showInMenu: boolean,
  menuOrder: integer,
  _status: enum('draft', 'published'),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Courses Collection:**
```sql
courses {
  id: uuid PRIMARY KEY,
  title: varchar,
  description: text,
  university: uuid REFERENCES universities(id),
  studyArea: varchar,
  degreeProgram: varchar,
  studyMode: varchar,
  duration: varchar,
  tuitionFee: decimal,
  requirements: text,
  _status: enum('draft', 'published'),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Relationships

**Database Relationships:**
- Universities → Users (one-to-one for university accounts)
- Universities → University Pages (one-to-many)
- Universities → Courses (one-to-many)
- Universities → Media (many-to-many for logo and images)

### Authentication & Security

#### Security Implementation

**Password Security:**
- Bcrypt hashing with salt rounds
- Minimum password requirements
- Password reset functionality
- Account lockout after failed attempts

**JWT Token Security:**
```typescript
{
  payload: {
    id: string,
    email: string,
    role: string,
    university?: string
  },
  expiresIn: '7d',
  algorithm: 'HS256'
}
```

**Route Protection:**
```typescript
// Middleware for protected routes
export function requireAuth(requiredRole?: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    
    try {
      const payload = jwt.verify(token, process.env.PAYLOAD_SECRET);
      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
```

**Data Validation:**
- Input sanitization for all user data
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting on API endpoints

---

## 🎨 Template System

### University Templates

The platform provides four professionally designed templates for universities to showcase their brand and offerings effectively.

#### Template Overview

**1. Modern University Template**
- **Design Philosophy**: Clean, contemporary aesthetic
- **Target Audience**: Progressive institutions, tech-focused universities
- **Features**:
  - Minimalist layout with bold typography
  - High-contrast color schemes
  - Modern card-based content sections
  - Focus on innovation and forward-thinking
- **Ideal For**: Technology universities, modern business schools, innovative institutions

**2. Classic University Template**
- **Design Philosophy**: Traditional, elegant presentation
- **Target Audience**: Established institutions with rich heritage
- **Features**:
  - Timeless design elements
  - Serif typography for academic feel
  - Balanced layouts with classical proportions
  - Emphasis on tradition and prestige
- **Ideal For**: Ivy League schools, traditional universities, historical institutions

**3. Tech University Template**
- **Design Philosophy**: Cutting-edge, digital-first design
- **Target Audience**: Technology and engineering schools
- **Features**:
  - Futuristic design elements
  - Bold color gradients
  - Interactive components
  - Tech-inspired visual elements
- **Ideal For**: Engineering schools, computer science programs, technical institutes

**4. Liberal Arts Template**
- **Design Philosophy**: Creative, artistic expression
- **Target Audience**: Arts, humanities, and creative institutions
- **Features**:
  - Expressive typography and layouts
  - Rich color palettes
  - Artistic visual elements
  - Creative content presentation
- **Ideal For**: Art schools, liberal arts colleges, creative institutes

### Block Components

#### University Template Blocks System

**UniversityHero Block**
- **Purpose**: Eye-catching header section for university pages
- **Layout Options**:
  - Default: Standard hero with title and subtitle
  - Centered: Centered content with background image
  - Left-aligned: Content aligned to left with image on right
  - Overlay: Text overlay on full-width background image
- **Customizable Elements**:
  - Title and subtitle text
  - Background image or video
  - Call-to-action buttons
  - Color overlays and opacity

**UniversityAbout Block**
- **Purpose**: Institutional information and statistics showcase
- **Layout Options**:
  - Side-by-side: Text and image in two columns
  - Image-top: Full-width image with text below
  - Text-only: Pure text content for detailed descriptions
  - Centered: Centered text with optional statistics
- **Features**:
  - Rich text content support
  - Statistics counter integration
  - Image gallery support
  - Video embedding capabilities

**UniversityPrograms Block**
- **Purpose**: Showcase academic programs and courses
- **Presentation Modes**:
  - Grid: Card-based grid layout for multiple programs
  - List: Detailed list view with descriptions
  - Carousel: Scrollable carousel for featured programs
- **Content Options**:
  - Program title and description
  - Duration and requirements
  - Tuition and financial information
  - Application deadlines and links

**UniversityContact Block**
- **Purpose**: Contact information and inquiry forms
- **Layout Features**:
  - Contact form with validation
  - Address and location mapping
  - Social media links integration
  - Office hours and contact methods
- **Form Fields**:
  - Name, email, phone (required)
  - Subject and message
  - Program interest selection
  - File attachment support

#### Block Implementation

**Technical Structure:**
```typescript
// Example: UniversityHero Block
export const UniversityHero: Block = {
  slug: 'universityHero',
  interfaceName: 'UniversityHeroBlock',
  fields: [
    {
      name: 'layout',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Centered', value: 'centered' },
        { label: 'Left Aligned', value: 'left' },
        { label: 'Overlay', value: 'overlay' }
      ]
    },
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'subtitle',
      type: 'textarea'
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media'
    },
    {
      name: 'buttons',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
        { name: 'style', type: 'select', options: [...] }
      ]
    }
  ]
}
```

### Customization Guide

#### Template Customization Process

**For Universities:**

1. **Initial Selection**
   - Choose template during registration
   - Preview all four options
   - Consider brand alignment and target audience
   - Selection can be changed later via dashboard

2. **Content Customization**
   - Access university dashboard
   - Use "Content Editor" tab
   - Modify blocks through Payload CMS interface
   - Real-time preview of changes

3. **Block Configuration**
   - Customize each block's layout and content
   - Upload custom images and media
   - Configure color schemes and typography
   - Set up contact forms and social links

**For Developers:**

1. **Template Extension**
   ```typescript
   // Create new template variant
   export const CustomTemplate = {
     name: 'Custom University',
     slug: 'custom',
     blocks: [
       UniversityHero,
       UniversityAbout,
       UniversityPrograms,
       UniversityContact,
       // Add custom blocks
     ],
     styles: {
       primaryColor: '#your-color',
       fontFamily: 'your-font',
       // Custom CSS variables
     }
   }
   ```

2. **Block Development**
   ```typescript
   // Create custom block
   export const CustomBlock: Block = {
     slug: 'customBlock',
     fields: [
       // Define custom fields
     ],
     admin: {
       useAsTitle: 'title'
     }
   }
   ```

3. **Styling Customization**
   - Modify Tailwind CSS classes
   - Create component-specific styles
   - Implement responsive design patterns
   - Ensure accessibility compliance

#### Best Practices

**Content Guidelines:**
- Use high-quality images (minimum 1200px width)
- Write compelling, concise copy
- Maintain consistent brand voice
- Optimize for SEO with proper headings

**Technical Guidelines:**
- Test responsiveness across devices
- Ensure fast loading times
- Implement proper alt text for images
- Use semantic HTML structure

**Accessibility:**
- Maintain proper color contrast ratios
- Provide keyboard navigation support
- Include screen reader compatible content
- Test with accessibility tools

---

## ⚙️ Configuration & Deployment

### Environment Setup

#### Environment Variables

**Required Configuration:**
```bash
# Core Application
PAYLOAD_SECRET=your-32-character-secret-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Database Configuration
DATABASE_URI=postgresql://username:password@localhost:5432/ustudy
# or for development
DATABASE_URI=sqlite://./database.sqlite

# Email Configuration (optional)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password

# File Upload (optional)
PAYLOAD_PUBLIC_CLOUD_STORAGE_BUCKET=your-bucket-name
CLOUD_STORAGE_ADAPTER=s3 # or 'gcs' for Google Cloud

# Security
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-encryption-key

# Third-party Services
RAZORPAY_KEY_ID=your-razorpay-key # for payments
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

**Development vs Production:**
```bash
# Development
NODE_ENV=development
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Production
NODE_ENV=production
PAYLOAD_PUBLIC_SERVER_URL=https://your-domain.com
```

#### Database Configuration

**PostgreSQL Setup (Recommended for Production):**
```bash
# Install PostgreSQL
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS with Homebrew
brew install postgresql

# Create database
createdb ustudy

# Set environment variable
DATABASE_URI=postgresql://username:password@localhost:5432/ustudy
```

**Migration Management:**
```bash
# Create migration
npm run payload migrate:create

# Run migrations
npm run payload migrate

# Check migration status
npm run payload migrate:status
```

### Production Deployment

#### Build Process

**Production Build:**
```bash
# Install dependencies
npm ci --only=production

# Generate types
npm run generate:types

# Build application
npm run build

# Start production server
npm run start
```

**Build Optimization:**
- Static asset optimization
- Image compression and resizing
- CSS and JavaScript minification
- Bundle size analysis

#### Database Migration

**Production Migration Strategy:**
```bash
# 1. Backup existing database
pg_dump ustudy > backup.sql

# 2. Run migrations
npm run payload migrate

# 3. Verify migration success
npm run payload migrate:status

# 4. Test application functionality
```

#### Security Checklist

**Pre-Deployment Security:**
- [ ] Update all environment variables
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable security headers
- [ ] Update default admin credentials
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging

### Hosting Options

#### 1. Payload Cloud (Recommended)

**Advantages:**
- Optimized for Payload CMS applications
- Automatic scaling and optimization
- Built-in CDN and caching
- Database management included
- One-click deployment

**Deployment Steps:**
1. Connect GitHub repository
2. Configure environment variables
3. Select deployment region
4. Deploy with automatic builds

**Pricing:** Pay-as-you-scale model

#### 2. Vercel Deployment

**Configuration for Vercel:**
```typescript
// payload.config.ts
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
  }),
  plugins: [
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  // ... rest of config
})
```

**Deployment Process:**
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Configure environment variables in Vercel dashboard

#### 3. Self-Hosting Options

**VPS Deployment (Ubuntu/CentOS):**

1. **Server Setup:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Application Deployment:**
   ```bash
   # Clone repository
   git clone https://github.com/opendesignsgit/ustudy.git
   cd ustudy
   
   # Install dependencies and build
   npm ci --only=production
   npm run build
   
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

**Docker Deployment:**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URI=postgresql://postgres:password@db:5432/ustudy
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      POSTGRES_DB: ustudy
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### 4. Cloud Platforms

**AWS Deployment:**
- EC2 instances for application hosting
- RDS for PostgreSQL database
- S3 for media file storage
- CloudFront for CDN
- Application Load Balancer for scaling

**Google Cloud Platform:**
- Compute Engine for hosting
- Cloud SQL for database
- Cloud Storage for media
- Cloud CDN for global distribution

**Microsoft Azure:**
- App Service for application hosting
- Azure Database for PostgreSQL
- Blob Storage for media files
- Azure CDN for content delivery

---

## 🧪 Testing

### Testing Strategy

#### Testing Pyramid

**Unit Tests (Foundation)**
- Individual component testing
- Utility function validation
- API endpoint testing
- Database model testing

**Integration Tests (Middle Layer)**
- Component interaction testing
- API workflow validation
- Database integration testing
- Authentication flow testing

**End-to-End Tests (Top Layer)**
- Complete user journey testing
- Cross-browser compatibility
- Performance testing
- Accessibility testing

#### Test Coverage Goals

**Target Coverage:**
- Unit Tests: 80%+ code coverage
- Integration Tests: Key workflows covered
- E2E Tests: Critical user paths verified

### Manual Testing Guide

#### User Registration and Authentication Testing

**Student Registration Flow:**
1. **Test Case: Successful Student Registration**
   - Navigate to registration page
   - Select "Student" user type
   - Fill valid information:
     - Name: "Test Student"
     - Email: "student@test.com"
     - Phone: "+1234567890"
     - Password: "TestPass123"
   - Submit form
   - **Expected Result**: Registration success, OTP verification prompt
   - Verify email/SMS OTP
   - **Expected Result**: Account created, redirected to dashboard

2. **Test Case: Duplicate Email Registration**
   - Attempt registration with existing email
   - **Expected Result**: Error message "Email already exists"

3. **Test Case: Invalid Data Validation**
   - Test various invalid inputs:
     - Empty required fields
     - Invalid email format
     - Weak password
     - Invalid phone number
   - **Expected Result**: Appropriate validation errors displayed

**University Registration Flow:**
1. **Test Case: University Registration with Template Selection**
   - Navigate to registration page
   - Select "University" from dropdown
   - Fill university details:
     - Name: "Test University"
     - Email: "admin@testuni.edu"
     - Phone: "+1234567890"
     - Website: "https://testuni.edu"
     - Description: "A test university for testing purposes"
   - Select template: "Modern University"
   - Submit registration
   - **Expected Result**: Registration success, account pending approval

2. **Test Case: Template Preview Functionality**
   - During registration, click template previews
   - **Expected Result**: Modal or preview showing template design
   - Switch between different templates
   - **Expected Result**: Selected template highlighted

#### Dashboard Functionality Testing

**Student Dashboard:**
1. **Test Case: Dashboard Access After Login**
   - Login as student user
   - **Expected Result**: Redirected to `/dashboard`
   - Verify dashboard shows student-specific content
   - Check navigation between dashboard tabs

2. **Test Case: Account Information Update**
   - Navigate to "Account Details" tab
   - Update student information
   - Submit changes
   - **Expected Result**: Success message, data saved

**University Dashboard:**
1. **Test Case: University Dashboard Navigation**
   - Login as university user
   - **Expected Result**: Access to university dashboard
   - Test all four tabs:
     - Account Details
     - Content Editor
     - View University Page
     - Manage Pages

2. **Test Case: University Page Management**
   - Navigate to "Manage Pages" tab
   - Create new page:
     - Title: "About Us"
     - Slug: "about-us"
     - Description: "University information page"
     - Enable "Show in Menu"
   - **Expected Result**: Page created successfully
   - Edit existing page
   - **Expected Result**: Changes saved
   - Delete page
   - **Expected Result**: Page removed from list

3. **Test Case: Public University Page Access**
   - Create university page via dashboard
   - Navigate to `/university/[page-slug]`
   - **Expected Result**: Page displays correctly with content
   - Verify SEO elements (title, meta description)

#### Admin Panel Testing

**Administrative Functions:**
1. **Test Case: Admin Panel Access**
   - Login with admin credentials
   - Navigate to `/admin`
   - **Expected Result**: Full admin panel access
   - Verify all collections visible

2. **Test Case: User Role Management**
   - Access Users collection
   - Create new user with specific role
   - **Expected Result**: User created with assigned role
   - Modify existing user role
   - **Expected Result**: Role updated successfully

3. **Test Case: University Approval Process**
   - Review pending university registrations
   - Approve university application
   - **Expected Result**: University status updated to active
   - Verify university can access dashboard

#### Template System Testing

**Template Functionality:**
1. **Test Case: Template Selection During Registration**
   - Register new university
   - Test each template selection:
     - Modern University
     - Classic University
     - Tech University
     - Liberal Arts
   - **Expected Result**: Template applied to university profile

2. **Test Case: Template Block Customization**
   - Access university content editor
   - Modify template blocks:
     - Update hero section content
     - Change about section layout
     - Customize program showcase
     - Edit contact information
   - **Expected Result**: Changes reflected on public page

#### Mobile Responsiveness Testing

**Device Testing:**
1. **Test Case: Mobile Navigation**
   - Access site on mobile device (or developer tools)
   - Test navigation menu functionality
   - **Expected Result**: Responsive menu works correctly

2. **Test Case: Mobile Form Interactions**
   - Complete registration on mobile
   - Test dashboard functionality on mobile
   - **Expected Result**: All forms and interactions work smoothly

### Automated Testing

#### Unit Test Examples

**Component Testing:**
```typescript
// __tests__/components/LoginForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/components/LoginForm'

describe('LoginForm', () => {
  test('renders login form elements', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  test('displays validation errors for empty fields', async () => {
    render(<LoginForm />)
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument()
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument()
  })
})
```

**API Testing:**
```typescript
// __tests__/api/auth.test.ts
import { testApiHandler } from 'next-test-api-route-handler'
import handler from '@/app/api/users/login/route'

describe('/api/users/login', () => {
  test('successful login returns JWT token', async () => {
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const response = await fetch({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        })
        
        const data = await response.json()
        expect(response.status).toBe(200)
        expect(data.token).toBeDefined()
        expect(data.user.email).toBe('test@example.com')
      }
    })
  })
})
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Authentication Issues

**Problem: "You are not allowed to perform this action" Error**

*Description:* University users receiving permission denied errors when accessing their dashboard.

*Root Cause:* Role-based access control not properly configured for university users.

*Solution:*
```typescript
// Check user role in payload.config.ts
export default buildConfig({
  admin: {
    user: Users.slug,
    // Ensure multi-collection auth is enabled
  },
  collections: [
    Users,
    Universities // Add to collections array
  ]
})

// Verify university user creation in Universities collection
const Universities: CollectionConfig = {
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          // Create corresponding user account
          const user = await payload.create({
            collection: 'users',
            data: {
              email: data.email,
              role: 'university-role',
              // ... other user data
            }
          })
          data.user = user.id
        }
      }
    ]
  }
}
```

#### 2. Template and Content Issues

**Problem: University Templates Not Loading**

*Description:* Selected templates not applying correctly to university pages.

*Solution:*
1. **Check Template Data:**
   ```bash
   # Verify template seed data exists
   ls scripts/university-templates-seed.json
   
   # Import template data if missing
   npm run payload seed
   ```

2. **Verify Template Selection:**
   ```typescript
   // Check university record has template field
   const university = await payload.findByID({
     collection: 'universities',
     id: universityId
   })
   console.log('Selected template:', university.template)
   ```

---

## 📞 Contact and Support

### Development Team

**Lead Developer:** Technical Architecture and Implementation  
**Frontend Team:** User Interface and Experience  
**Backend Team:** API Development and Database Management  
**QA Team:** Testing and Quality Assurance  

### Getting Help

**For Technical Issues:**
- Create GitHub issue with detailed description
- Include error logs and reproduction steps
- Specify environment details (OS, Node version, etc.)
- Tag with appropriate labels (bug, enhancement, question)

**For Feature Requests:**
- Submit detailed feature proposal
- Include use cases and expected benefits
- Provide mockups or examples if available
- Engage with community for feedback

**For Security Issues:**
- Report via private channels only
- Include detailed vulnerability description
- Follow responsible disclosure practices
- Allow time for proper resolution

---

## 🏆 Conclusion

Ustudy Global represents a comprehensive solution for connecting students with educational opportunities worldwide. Built on modern web technologies and following best practices, the platform provides:

✅ **Scalable Architecture** - Ready for growth and expansion  
✅ **User-Friendly Interface** - Intuitive for all user types  
✅ **Professional Templates** - Beautiful university presentations  
✅ **Robust Security** - Enterprise-grade protection  
✅ **Developer-Friendly** - Well-documented and maintainable  
✅ **Mobile Responsive** - Works across all devices  
✅ **SEO Optimized** - Built for discoverability  

The platform successfully bridges the gap between students seeking education and universities offering programs, creating a thriving ecosystem for educational discovery and institutional growth.

### Next Steps for Users

**Students:** Start exploring universities and courses that match your interests and career goals.

**Universities:** Create your professional presence and showcase your programs to a global audience.

**Developers:** Contribute to the platform's growth and help build the future of educational technology.

**Administrators:** Maintain and optimize the platform to serve the educational community effectively.

---

*This documentation is actively maintained and updated. For the latest information, please check the official repository and release notes.*

**Documentation Version:** 1.0.0  
**Last Updated:** December 2024  
**Platform Version:** Ustudy Global v1.0.0  

---

## 📄 License and Credits

**License:** MIT License - see LICENSE file for details  
**Framework:** Built with Next.js and Payload CMS  
**Design:** Custom templates and components  
**Contributors:** Open source community and development team  

For more information, visit our [GitHub repository](https://github.com/opendesignsgit/ustudy) or contact our support team.

---

*© 2024 Ustudy Global. All rights reserved.*
