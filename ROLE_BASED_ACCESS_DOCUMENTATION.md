# Role-Based Access Control (RBAC) Documentation

## Overview

This document outlines the comprehensive role-based access control system implemented in the UStudy platform. The system provides granular permissions management across all collections and user types.

## Rule System

### Permission Types

The system uses five core permission types for each collection:

- **Create**: Permission to create new records in the collection
- **Read**: Permission to view records in the collection
- **Update**: Permission to modify existing records
- **Delete**: Permission to delete records
- **Self-Control**: When enabled, restricts the above permissions to only the user's own content

### User Roles

#### Admin
- **Full Access**: Complete access to all collections and operations
- **User Management**: Can create, modify, and delete all user types
- **System Configuration**: Access to role settings and system-wide configurations

#### University-Role
- **Own University Management**: Full CRUD access to their own university data
- **Course Management**: Create, read, update, delete courses linked to their university
- **University Pages**: Full CRUD access to pages under their university
- **Booking Visibility**: Read-only access to bookings/enrollments for their courses
- **Media Management**: Upload and manage media files with self-control

#### Editor
- **Content Management**: Access to posts, pages, and general content
- **Limited Scope**: Cannot access university-specific or user management functions

#### Post-Editor
- **Blog Management**: Focused access to posts and related content
- **Restricted Access**: Limited to content creation and editing

#### Student-Role
- **Profile Management**: Can update their own student profile
- **Course Browsing**: Read access to courses and universities
- **Enrollment Management**: Can create and view their own bookings

## Self-Control Implementation

### University Data Isolation

When `selfControl: true` is enabled for university-role users:

1. **Universities Collection**: Can only access their own university record
2. **Courses Collection**: Limited to courses where `university` field matches their university ID
3. **University Pages**: Only pages linked to their university
4. **Bookings**: Can view enrollments for courses belonging to their university
5. **Media**: Can only manage media files they uploaded

### Query Filtering

The system automatically applies query filters based on user context:

```typescript
// Example: University user accessing courses
{
  university: {
    equals: userUniversityId
  }
}

// Example: Student accessing their own bookings
{
  customer: {
    equals: userId
  }
}
```

## Collection Grouping

Collections are organized into logical groups for better admin panel navigation:

### User Management
- **Users**: System users with roles
- **RoleSettings**: Permission configurations for each role
- **Groups**: User group management

### Content
- **Posts**: Blog posts and articles
- **Pages**: Static pages
- **Categories**: Content categorization
- **Media**: File uploads and media management

### Universities
- **Universities**: University profiles and information
- **Students**: Student accounts and profiles
- **Courses**: University course offerings
- **Bookings**: Course enrollments and bookings
- **UniversityPages**: University-specific pages

## Admin Panel Visibility

Collections are hidden/shown in the admin panel based on user permissions:

```typescript
// Simplified visibility logic
- Admin users: See all collections
- University users: See only University group + allowed collections
- Content editors: See Content group + specific permissions
- Students: Limited admin access (primarily their profile)
```

## Frontend Authentication

### Multi-Collection Support

The system supports authentication from multiple collections:

- **Users Collection**: Admin, editor, university-role, post-editor users
- **Universities Collection**: Direct university authentication
- **Students Collection**: Student authentication

### Dashboard Routing

Users are automatically routed to appropriate dashboards:

- **University users**: University management dashboard with content editing
- **Students**: Student dashboard with course browsing and profile management
- **Admin/Editors**: Full admin panel access

## API Endpoints

### Authentication Endpoints

- `/api/users/login` - User collection authentication
- `/api/universities/login` - University collection authentication  
- `/api/students/login` - Student collection authentication

### Role-Based API Access

All API endpoints respect the role-based access controls:

- Create operations check `create` permission
- Read operations apply query filters based on `selfControl`
- Update operations validate ownership for self-controlled collections
- Delete operations respect role permissions

## Content Rendering

### University Pages

University content supports multiple formats:

```typescript
// String content (HTML)
if (typeof content === 'string') {
  return <div dangerouslySetInnerHTML={{ __html: content }} />
}

// Lexical/Rich text content
return <RichText data={content} enableGutter={false} />
```

### Consistent Patterns

All content rendering follows the same patterns used in the courses collection to ensure consistency.

## Security Features

1. **JWT Integration**: User roles and permissions stored in JWT tokens
2. **Server-Side Validation**: All access checks performed server-side
3. **Query-Level Filtering**: Database queries automatically filtered by permissions
4. **Multi-Layer Security**: Access controls at collection, field, and admin levels

## Configuration

### Role Settings Collection

Permissions are configured through the RoleSettings collection:

1. Navigate to `/admin/collections/role-settings`
2. Select or create a role configuration
3. Set permissions for each collection
4. Enable self-control as needed
5. Save configuration

### Default Permissions

New roles automatically receive default permissions based on their type:

- **Admin**: Full access to all collections
- **University-role**: University-specific permissions with self-control
- **Editor**: Content management permissions
- **Student-role**: Profile and booking permissions

This system provides a robust, scalable foundation for managing user access across the entire platform while maintaining security and usability.