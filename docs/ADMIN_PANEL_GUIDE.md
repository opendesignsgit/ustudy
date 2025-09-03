# UStudy - Complete Admin Panel Guide

## Table of Contents
1. [Admin Panel Overview](#admin-panel-overview)
2. [Admin Login & Access](#admin-login--access)
3. [Collections Management](#collections-management)
4. [User Management](#user-management)
5. [Content Management](#content-management)
6. [Settings & Configuration](#settings--configuration)
7. [CRUD Operations Guide](#crud-operations-guide)
8. [Screenshots Reference](#screenshots-reference)

## Admin Panel Overview

The UStudy admin panel is powered by PayloadCMS and provides comprehensive management capabilities for the entire platform. Administrators can manage users, content, courses, universities, and system settings through an intuitive interface.

**Admin Panel URL**: `http://localhost:3000/admin` (or your domain + `/admin`)

**Admin Login Credentials**:
- Username: `kavirajan@opendesignsin.com`
- Password: `admin@123`

### Admin Panel Features
- **User Management**: Students, Universities, and Admin users
- **Content Management**: Pages, Posts, Courses
- **Media Management**: Images, documents, files
- **Settings Management**: Platform configuration
- **Role-Based Access Control**: Granular permissions
- **Data Analytics**: User and course statistics

## Admin Login & Access

### Step 1: Access Admin Panel
1. Navigate to `/admin` URL
2. You'll see the PayloadCMS login interface
3. Enter admin credentials
4. Click "Login" to access dashboard

### Step 2: Admin Dashboard Overview
After successful login, you'll see:
- **Collections** menu on the left sidebar
- **Media** management section
- **Settings** configuration area
- **User profile** and logout options

### Navigation Structure
```
Admin Panel
├── Collections
│   ├── Users
│   ├── Students
│   ├── Universities
│   ├── Courses
│   ├── Posts
│   ├── Pages
│   ├── Countries
│   ├── Categories
│   ├── Media
│   └── Settings
├── Media Library
└── Account Settings
```

## Collections Management

### 1. Users Collection
**Purpose**: Manage admin and staff accounts

#### Viewing Users
1. Click "Users" in the left sidebar
2. View list of all system users
3. See user roles and status
4. Filter by role or status

#### Adding New User
1. Click "Create New" button
2. Fill required fields:
   - Email (unique identifier)
   - Password
   - Role (admin, editor, etc.)
   - Additional permissions
3. Click "Save" to create user

#### Editing User
1. Click on any user from the list
2. Update user information:
   - Email address
   - Role assignment
   - Permission settings
   - Account status
3. Save changes

#### Deleting User
1. Select user from list
2. Click "Delete" button
3. Confirm deletion
4. User will be permanently removed

### 2. Students Collection
**Purpose**: Manage student accounts and registrations

#### Viewing Students
1. Navigate to "Students" collection
2. View paginated list of all students
3. See student details:
   - Name and contact information
   - Registration date
   - Course enrollments
   - Payment status

**Screenshot Reference**: `screenshots/Phase 1 & Phase 2 - Backend Screen/Phase 2 - Student Register - Detail - 2nd Screen.jpeg`

#### Adding Student
1. Click "Create New Student"
2. Fill student information:
   - Full Name
   - Email Address
   - Phone Number
   - Country Selection
   - Additional details
3. Set account status
4. Save student record

#### Editing Student Information
1. Select student from list
2. Edit any field:
   - Personal information
   - Contact details
   - Course enrollments
   - Account status
3. Save changes

#### Managing Student Enrollments
1. Open student record
2. Navigate to "Courses" section
3. Add or remove course enrollments
4. Update payment status
5. Save enrollment changes

### 3. Universities Collection
**Purpose**: Manage university accounts and profiles

#### Viewing Universities
1. Click "Universities" in sidebar
2. See list of all registered universities
3. View university status and verification

**Screenshot Reference**: `screenshots/Phase 1 & Phase 2 - Backend Screen/Univerisities - Detail Screen.jpeg`

#### Adding New University
1. Click "Create New University"
2. Fill university details:
   - University Name
   - Official Email
   - Contact Information
   - Website URL
   - Description
   - Country/Location
3. Set verification status
4. Assign template (if applicable)
5. Save university record

#### Editing University
1. Select university from list
2. Update any information:
   - Basic details
   - Contact information
   - Description and content
   - Verification status
   - Template assignment
3. Save changes

#### University Verification Process
1. Open university record
2. Review submitted information
3. Verify contact details
4. Check documentation
5. Update verification status
6. Send notification to university

### 4. Courses Collection
**Purpose**: Manage course catalog and content

#### Viewing Courses
1. Navigate to "Courses" collection
2. See all courses with details:
   - Course title and description
   - Associated university
   - Price and duration
   - Publication status

**Screenshot Reference**: `screenshots/Phase 1 & Phase 2 - Backend Screen/Course Detail Page - 1st Screen - META TAB.jpeg`

#### Adding New Course
1. Click "Create New Course"
2. Fill course information:
   - Title and Description
   - University Assignment
   - Price and Currency
   - Duration and Schedule
   - Requirements
3. Add course content (Content Tab)
4. Set SEO metadata (Meta Tab)
5. Upload course materials
6. Set publication status
7. Save course

**Screenshot Reference**: `screenshots/Phase 1 & Phase 2 - Backend Screen/Course Detail Page - 11th Screen - CONTENT TAB.jpeg`

#### Course Content Management
The course editor includes multiple tabs:

**Meta Tab**:
- SEO title and description
- Meta tags
- Preview image
- Social sharing settings

**Content Tab**:
- Rich text course description
- Course modules and lessons
- Learning objectives
- Prerequisites
- Assessment criteria

#### Editing Course
1. Select course from list
2. Update any section:
   - Basic information
   - Content and modules
   - Pricing
   - Media files
   - Publication settings
3. Save changes

#### Course Approval Process
1. Review course submissions
2. Check content quality
3. Verify pricing and details
4. Approve or request changes
5. Publish approved courses

### 5. Posts Collection
**Purpose**: Manage blog posts and news content

#### Creating Blog Posts
1. Go to "Posts" collection
2. Click "Create New Post"
3. Add post content:
   - Title and slug
   - Post content (rich text)
   - Featured image
   - Categories and tags
   - SEO metadata
4. Set publication status
5. Schedule or publish immediately

#### Managing Post Categories
1. Create post categories
2. Organize content structure
3. Assign posts to categories
4. Manage category hierarchy

### 6. Pages Collection
**Purpose**: Manage static website pages

#### Creating Static Pages
1. Navigate to "Pages" collection
2. Create new page
3. Use block-based editor:
   - Hero sections
   - Content blocks
   - Call-to-action blocks
   - Media blocks
4. Configure SEO settings
5. Publish page

### 7. Countries Collection
**Purpose**: Manage country data and regional settings

#### Managing Countries
1. Access "Countries" collection
2. View all country records
3. Each country includes:
   - Country name and code
   - Currency information
   - Flag/logo images
   - Regional settings

**Screenshot Reference**: `screenshots/Phase 1 & Phase 2 - Backend Screen/Countries - Detail 2nd Screen.jpeg`

#### Adding New Country
1. Click "Create New Country"
2. Fill country details:
   - Country Name
   - Country Code (ISO)
   - Currency Name
   - Currency Code
   - Currency Value (exchange rate)
   - Upload flag/logo
   - Upload country image
3. Save country record

#### Editing Country Information
1. Select country from list
2. Update any information:
   - Basic details
   - Currency information
   - Exchange rates
   - Images and logos
3. Save changes

### 8. Media Management

#### Media Library Overview
1. Click "Media" in sidebar
2. View all uploaded files
3. Organize by type:
   - Images
   - Documents
   - Videos
   - Other files

#### Uploading Media
1. Click "Upload" button
2. Select files from computer
3. Add file descriptions
4. Organize into folders
5. Save uploaded files

#### Managing Media Files
1. Select any media file
2. Edit file information:
   - Title and description
   - Alt text for images
   - File organization
3. Delete unnecessary files
4. Optimize file sizes

## Settings & Configuration

### 1. Role Settings
**Purpose**: Configure user roles and permissions

#### Accessing Role Settings
1. Navigate to "Settings" > "Role Settings"
2. View existing role configurations
3. See permission matrix

#### Creating New Role
1. Click "Create New Role"
2. Define role details:
   - Role name
   - Description
   - Permission checkboxes for each collection
3. Set CRUD permissions:
   - Create rights
   - Read rights
   - Update rights
   - Delete rights
4. Save role configuration

#### Managing Permissions
The permission system includes:
- **Collection Access**: Which collections the role can access
- **CRUD Operations**: Create, Read, Update, Delete permissions
- **Self-Control**: Users can only manage their own content
- **Admin Access**: Access to admin panel features

### 2. General Settings
1. Platform configuration
2. Email settings
3. Payment gateway configuration
4. SEO defaults
5. Social media settings

### 3. Payment Settings
1. Razorpay configuration
2. Payment methods
3. Currency settings
4. Transaction fees
5. Refund policies

**Screenshot Reference**: `screenshots/Phase 1 & Phase 2 - Backend Screen/Payment List of Students Screen.jpeg`

## CRUD Operations Guide

### Create Operations

#### Standard Create Process
1. Navigate to desired collection
2. Click "Create New" button
3. Fill all required fields (marked with *)
4. Add optional information
5. Set status and permissions
6. Save record

#### Validation Rules
- Email fields must be unique
- Required fields cannot be empty
- File uploads must meet size/format requirements
- URLs must be properly formatted

### Read Operations

#### Viewing Records
1. Select collection from sidebar
2. Browse paginated results
3. Use search functionality
4. Apply filters as needed
5. Sort by different columns

#### Search and Filter
- **Text Search**: Search across multiple fields
- **Status Filter**: Filter by publication status
- **Date Range**: Filter by creation/update dates
- **Category Filter**: Filter by assigned categories
- **User Filter**: Filter by assigned users

### Update Operations

#### Editing Records
1. Click on any record from list view
2. Modify any editable field
3. Add or remove relationships
4. Update media files
5. Change status settings
6. Save changes

#### Bulk Update
1. Select multiple records (checkbox)
2. Choose bulk action
3. Apply changes to all selected
4. Confirm bulk operation

### Delete Operations

#### Single Delete
1. Open record for editing
2. Click "Delete" button
3. Confirm deletion
4. Record permanently removed

#### Bulk Delete
1. Select multiple records
2. Choose "Delete" from bulk actions
3. Confirm mass deletion
4. All selected records removed

#### Soft Delete (where applicable)
- Some records may be "archived" instead of deleted
- Archived records can be restored
- Maintains data integrity

## Data Management Best Practices

### 1. Regular Backups
- Export data regularly
- Backup media files
- Document configuration changes
- Test restore procedures

### 2. User Management
- Regularly review user accounts
- Remove inactive accounts
- Update permissions as needed
- Monitor admin activities

### 3. Content Quality
- Review user-submitted content
- Maintain content standards
- Update outdated information
- Optimize media file sizes

### 4. Performance Monitoring
- Monitor database performance
- Optimize slow queries
- Clean up unnecessary data
- Regular maintenance tasks

## Screenshots Reference

### Backend Management Screenshots
Located in: `screenshots/Phase 1 & Phase 2 - Backend Screen/`

1. **Course Management**
   - `Course Detail Page - 1st Screen - META TAB.jpeg` - Course SEO settings
   - `Course Detail Page - 11th Screen - CONTENT TAB.jpeg` - Course content editor

2. **University Management**
   - `Univerisities - Detail Screen.jpeg` - University profile management

3. **Student Management**
   - `Phase 2 - Student Register - Detail - 2nd Screen.jpeg` - Student details

4. **Content Management**
   - `Study Areas - Screen Listing.jpeg` - Study areas listing
   - `Department DetAil Screen Edit.jpeg` - Department management

5. **Location Management**
   - `Countries - Detail 2nd Screen.jpeg` - Country configuration

6. **Financial Management**
   - `Payment List of Students Screen.jpeg` - Payment tracking

## Troubleshooting Common Issues

### 1. Login Issues
- Verify credentials
- Check account status
- Clear browser cache
- Contact system administrator

### 2. Upload Problems
- Check file size limits
- Verify file formats
- Ensure sufficient storage
- Check internet connection

### 3. Permission Errors
- Verify user role
- Check collection permissions
- Contact administrator
- Review access logs

### 4. Data Not Saving
- Check required fields
- Verify data validation
- Check for conflicts
- Try refreshing page

---

**Note**: This guide covers the standard admin panel operations. For advanced configurations or custom features, refer to the technical documentation or contact the development team.