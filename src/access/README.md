# Role-Based Access Control (RBAC) System

This document describes the comprehensive role-based access control system implemented in the UStudy application.

## Overview

The RBAC system provides fine-grained access control for all collections and operations in the application. It supports dynamic permission management through the RoleSettings collection and enforces business rules for different user types.

## User Roles

### Admin (`admin`)
- **Full Access**: Complete CRUD access to all collections
- **User Management**: Can create, update, and delete users and roles
- **System Configuration**: Can modify role settings and permissions
- **No Restrictions**: Bypasses all self-control restrictions

### University Role (`university-role`)
- **Self Control**: Can only manage content related to their own university
- **Universities**: Read/Update own university (no create/delete)
- **University Pages**: Full CRUD for own university pages
- **Courses**: Full CRUD for own university courses
- **Bookings**: Read-only access to enrollments for own courses
- **Media**: Full CRUD with self-control (own uploaded media)
- **Restricted Access**: Cannot access posts, categories, pages, or other universities' data

### Editor (`editor`)
- **Content Management**: Full CRUD access to posts, media, and categories
- **No Self Control**: Can manage all content in allowed collections
- **No University Access**: Cannot access university-specific collections

### Post Editor (`post-editor`)
- **Limited Content**: Create, read, update posts only (no delete)
- **No Self Control**: Can manage all posts
- **Restricted Access**: No access to other collections

## Rule Definitions

### Self Control
When enabled, users can only manage content they own or is associated with them:

- **University Users**: Limited to their own university and related content
- **Regular Users**: Limited to content they created
- **Delete Protection**: University data cannot be deleted by university users

#### University Self Control Rules:
- **Universities Collection**: Can only access their own university record
- **University Pages**: Can only manage pages for their university
- **Courses**: Can only manage courses for their university  
- **Bookings**: Can only read enrollments for their own university's courses
- **Media**: Can only manage media they uploaded

### Operation Types

#### View (`read`)
- User can view/list records in the collection
- May be combined with self-control for filtered access

#### Create (`create`)
- User can create new records in the collection
- Self-control applies to creation permissions

#### Edit (`update`)
- User can modify existing records
- Often combined with self-control for ownership restrictions

#### Delete (`delete`)
- User can remove records from the collection
- University users cannot delete university records (delete protection)

## Technical Implementation

### Access Control Functions

#### `createRoleBasedAccess(operation, collection, options)`
Main access control function that:
1. Checks user authentication
2. Queries RoleSettings collection for permissions
3. Applies self-control logic when enabled
4. Falls back to default rules if no settings found

#### `createRoleBasedVisibility(collection)`
Controls admin panel sidebar visibility:
1. Hides collections from users who don't have access
2. Shows only relevant collections based on user role
3. Improves user experience by removing clutter

#### `createRoleBasedFieldAccess(operation, collection, field)`
Field-level access control:
1. Restricts sensitive fields (role, university associations)
2. Prevents unauthorized field modifications
3. Maintains data integrity

### Self-Control Implementation

The self-control system uses different strategies based on collection type:

```typescript
// University-specific content
if (userInfo.role === 'university-role' && userInfo.university) {
  switch (collectionSlug) {
    case 'universities':
      return id ? Number(userInfo.university) === Number(id) : true
    
    case 'university-pages':
    case 'courses':
      // Check if content belongs to user's university
      
    case 'bookings':
      // Check if booking is for user's course
  }
}
```

### Collection Grouping

Collections are organized into logical groups in the admin panel:

#### User Management
- Users
- RoleSettings

#### Universities  
- Universities
- UniversityPages
- Courses
- Bookings
- Students
- Countries
- UniversityTemplates

#### Content Management
- Posts
- Media
- Categories
- Pages

## Database Integration

### RoleSettings Collection
Stores dynamic permission configurations:
```typescript
{
  roleName: 'university-role',
  permissions: {
    universities: {
      create: false,
      read: true,
      update: true,
      delete: false,
      selfControl: true
    },
    // ... other collections
  }
}
```

### Default Permissions
When no RoleSettings exist, the system falls back to hardcoded defaults:
- Ensures system works even without database configuration
- Provides sensible security defaults
- Maintains consistency with documented rules

## Security Considerations

### Access Control Enforcement
- **Backend Only**: All access control is enforced server-side
- **No Client Trust**: Frontend visibility is for UX only
- **Deep Validation**: Checks ownership at multiple levels
- **Audit Trail**: All access decisions are logged

### Data Protection
- **University Isolation**: Complete separation between university data
- **Delete Protection**: Critical data cannot be accidentally removed
- **Field Security**: Sensitive fields protected from unauthorized access
- **Relationship Integrity**: Related data access properly validated

## Usage Examples

### Adding New Role
1. Create entry in RoleSettings collection
2. Define permissions for each collection
3. Set self-control flags as needed
4. Users with the role automatically get new permissions

### University Onboarding
1. University registers through public form
2. System creates university-role user automatically
3. User inherits university-specific permissions
4. Can immediately manage their content

### Content Management
1. Editors can manage all posts/media
2. University users see only their content
3. Admin users have full system access
4. Post editors have limited post access

## Monitoring and Debugging

### Access Decision Logging
All access control decisions are logged with:
- User information
- Requested operation
- Collection and record details
- Permission source (RoleSettings vs default)
- Final decision and reasoning

### Common Issues
- **Database Connection**: Fallback to default permissions
- **Missing RoleSettings**: System uses hardcoded defaults
- **Permission Conflicts**: Admin override always wins
- **Self-Control Errors**: Graceful degradation to restricted access

## Future Enhancements

### Planned Features
- **Time-based Permissions**: Temporary access grants
- **Resource Quotas**: Limits on uploads, posts, etc.
- **Advanced Workflows**: Approval processes for content
- **API Access Control**: Role-based API endpoint restrictions

### Migration Support
- **Backwards Compatibility**: Existing access controls preserved
- **Gradual Migration**: Can enable new system incrementally
- **Data Preservation**: All existing permissions maintained