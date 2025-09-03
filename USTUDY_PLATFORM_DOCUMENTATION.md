# UStudy Global - Complete User Flow Documentation

This comprehensive documentation covers all user flows in the UStudy Global platform, including frontend navigation, admin management, student registration/login, and university management flows.

## 🏠 Homepage Overview

![Homepage](https://github.com/user-attachments/assets/135a4be5-e376-4007-b8e5-883dbfb8eacf)

The homepage serves as the main entry point for all users, featuring:

- **Hero Section**: "Earn While you Learn Online" with study area categories
- **Medical Programs**: Country-specific medical program listings
- **About Section**: Information about UStudy Global's mission
- **Statistics**: 175+ Courses, 17+ Institution Partners, 95+ Flexible Learning, 140+ Expert Instructors
- **Academic Path Discovery**: Interactive course category carousel
- **University Solutions**: Comprehensive service offerings
- **Study Destinations**: Malaysia and Singapore options
- **University Showcases**: BAC Singapore, Veritas Malaysia, BAC Malaysia
- **Contact Form**: For inquiries and support

### Navigation Elements
- **Logo**: UStudy Global brand logo (top-left)
- **Search**: Global search functionality 
- **LOG IN**: User authentication entry point
- **SIGN UP**: New user registration

---

## 🔐 Authentication Flows

### Student/User Login Flow

![Login Page](https://github.com/user-attachments/assets/04770a76-a860-4fba-9f86-583adbac8e2e)

**URL**: `http://localhost:3000/login`

#### Login Form Features:
- **Email/Phone**: Multi-format authentication support
- **Password**: Secure password entry
- **Forgot Password**: Password recovery option
- **New User Registration**: Direct link to registration

#### User Credentials (Demo):
- **Email**: kavirajan@opendesignsin.com
- **Password**: admin@123

### Student Registration Flow

![Student Registration](https://github.com/user-attachments/assets/817be6a8-e31a-4611-96dd-32aaa186d6da)

**URL**: `http://localhost:3000/register`

#### Registration Form Fields:
1. **Full Name**: Student's complete name
2. **Phone**: Mobile number with verification
   - OTP verification required
   - "Verify" button functionality
3. **Email**: Email address with verification
   - OTP verification required  
   - "Verify" button functionality
4. **College**: Educational institution
5. **Department**: Field of study
6. **Terms & Conditions**: Mandatory agreement checkbox

#### Registration Process:
1. Fill all required fields
2. Verify phone number via OTP
3. Verify email address via OTP
4. Accept terms and conditions
5. Submit registration
6. Auto-generation of temporary password
7. Welcome email with credentials

---

## 🎓 Student Dashboard Flow

![Dashboard Loading](https://github.com/user-attachments/assets/4e1e2e9e-8a06-4926-a98e-32959d22b9c4)

**URL**: `http://localhost:3000/dashboard`

### Dashboard Navigation Sidebar:
- **Home**: Dashboard overview
- **Account Details**: Profile management
- **My Courses**: Enrolled courses view
- **Logout**: Session termination

### Dashboard Features:
- **Unified Dashboard**: Same route for both students and universities
- **Conditional Rendering**: Different components based on user type
- **Authentication Guards**: Automatic redirect if not logged in
- **Real-time Data**: Fresh data fetching from API endpoints

---

## 🏛️ Admin Panel Flow

### Admin Panel Access

![Admin First User Setup](https://github.com/user-attachments/assets/16d06ed3-b217-495a-8bd6-26595eb7d971)

**URL**: `http://localhost:3000/admin/`

#### Admin Credentials:
- **Username**: kavirajan@opendesignsin.com
- **Password**: eei82QaiezzswVW

#### First-Time Setup:
1. Navigate to admin panel
2. Create first admin user
3. Fill required fields:
   - Email
   - New Password
   - Confirm Password
   - Name
4. Complete setup

### Admin Dashboard

![Admin Dashboard](https://github.com/user-attachments/assets/f54aa58b-edf6-4552-9250-222fdf1c6d68)

**URL**: `http://localhost:3000/admin`

#### Collections Management:

**Content Management:**
- **Pages**: Static page content
- **Posts**: Blog posts and articles
- **Media**: File and image management
- **Categories**: Content categorization

**User Management:**
- **Users**: Admin user accounts
- **Students**: Student account management
- **Universities**: University account management

**Academic Management:**
- **Courses**: Course catalog management
- **Intake Months**: Academic calendar
- **Study Modes**: Learning formats
- **Study Years**: Academic year settings
- **Study Areas**: Field of study categories
- **Departments**: Academic departments
- **Degree Programs**: Program offerings

**System Management:**
- **Countries**: Geographic data
- **Enrollments**: Student enrollments
- **Redirects**: URL management
- **Forms**: Contact forms
- **Form Submissions**: Form responses
- **Search Results**: Search functionality

#### Global Settings:
- **Header**: Navigation configuration
- **Footer**: Footer content management
- **Website Settings**: Site-wide configurations

#### Admin Features:
- **Role-Based Access Control**: Permission management
- **Multi-Collection Authentication**: Support for different user types
- **Content Management**: Rich text editing capabilities
- **Media Management**: File upload and organization
- **Search Functionality**: Global content search
- **Live Preview**: Real-time content preview

---

## 🏫 University Management Flow

Based on the repository implementation, the platform supports university registration and management:

### University Registration Flow
- **Separate Registration**: Universities have dedicated registration process
- **Template Selection**: Universities can choose from predefined templates
- **OTP Verification**: Email and phone verification required
- **Account Association**: Automatic user account creation

### University Dashboard Features
- **Account Details**: University information management
- **Content Editor**: Rich text content management using Lexical editor
- **University Page View**: Preview of public university page
- **University Pages Manager**: Manage multiple university pages

### University Public Pages
- **Dynamic Routes**: `/university/[slug]` for each university
- **Template-Based**: Customizable templates for university branding
- **SEO Optimized**: Search engine friendly structure
- **Responsive Design**: Mobile-friendly layouts

---

## 📚 Courses and Academic Features

![Courses Page](https://github.com/user-attachments/assets/8c5f2d5e-9e95-4a2e-8f4d-1e2d9c1a2b3c)

**URL**: `http://localhost:3000/courses`

### Course Management:
- **Course Catalog**: Browse available courses
- **Filter Options**: Search by study areas, countries, institutions
- **Course Details**: Comprehensive course information
- **Enrollment Process**: Course registration and payment

### Academic Features:
- **Study Areas**: Computer Science, Psychology, Education, Media & Communications, Law, Business, Digital Technology, Digital Marketing, Hospitality Management
- **Countries**: Malaysia, Singapore, Kazakhstan, Barbados, Kyrgyzstan, Tajikistan
- **Institutions**: BAC Singapore, Veritas Malaysia, BAC Malaysia

---

## 🌐 Website Navigation Patterns

### Main Navigation:
1. **Home** → Homepage with all features
2. **Courses** → Course catalog and filtering
3. **Services** → University solutions and services
4. **Contact Us** → Contact form and information

### User Journey Patterns:

#### New Student Journey:
1. **Homepage** → Learn about platform
2. **Sign Up** → Register new account
3. **Verification** → Complete phone/email verification
4. **Login** → Access dashboard
5. **Dashboard** → Manage account and courses
6. **Courses** → Browse and enroll
7. **Account** → Update profile information

#### University Journey:
1. **Homepage** → Discover platform
2. **University Registration** → Create university account
3. **Template Selection** → Choose university template
4. **Dashboard** → Manage university content
5. **Public Page** → Customize university presence
6. **Content Management** → Update information

#### Admin Journey:
1. **Admin Panel** → Access management interface
2. **User Management** → Manage students and universities
3. **Content Management** → Update site content
4. **Course Management** → Manage course catalog
5. **System Settings** → Configure platform

---

## 🔧 Technical Architecture

### Frontend Technology:
- **Next.js 15**: App router with dynamic routes
- **TypeScript**: Full type safety
- **Tailwind CSS**: Responsive styling
- **React Hook Form**: Form management

### Backend Technology:
- **Payload CMS**: Headless content management
- **SQLite/PostgreSQL**: Database options
- **JWT Authentication**: Secure token-based auth
- **Multi-Collection Auth**: Support for different user types

### Key Features:
- **Role-Based Access Control**: Granular permissions
- **OTP Verification**: Phone and email verification
- **Rich Text Editing**: Lexical editor integration
- **Live Preview**: Real-time content preview
- **Responsive Design**: Mobile-first approach
- **SEO Optimization**: Search engine friendly

---

## 📞 Contact Information

**Physical Address:**
2nd Floor, Chettinad Chambers, 39,
Dr. Radha Krishnan Salai, 5th Street,
Mylapore, Chennai – 600 004.

**Contact Details:**
- **Email**: info@ustudyglobal.in
- **Phone**: 89 39 39 39 62 / 89 39 39 39 18

**Social Media:**
- Instagram: @ustudy_global
- Twitter/X: @ustudy_global
- LinkedIn: ustudy-global
- YouTube: UStudy Global Channel

---

## 🚀 Getting Started

### For Students:
1. Visit the homepage
2. Click "SIGN UP" to register
3. Complete verification process
4. Login to access dashboard
5. Browse courses and enroll

### For Universities:
1. Access university registration
2. Complete institution verification
3. Select university template
4. Set up university dashboard
5. Manage public university page

### For Administrators:
1. Access admin panel at `/admin`
2. Create admin user account
3. Manage collections and content
4. Configure system settings
5. Monitor user activities

This documentation provides a complete overview of all user flows and navigation patterns within the UStudy Global platform, enabling users to understand and efficiently navigate the system.