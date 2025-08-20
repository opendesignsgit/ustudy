# University Admin Panel Access Fix

## Problem
University users were getting "Unauthorized, this user does not have access to the admin panel" error when trying to access the admin panel from their dashboard. The issue was manifesting as:

- 307 redirect from `/admin` to `/admin/unauthorized`
- 404 error on `/api/users/me` endpoint
- University users unable to access admin panel despite being authenticated

## Root Cause
Payload CMS was configured to only allow users from the 'users' collection to access the admin panel. University users (from the 'universities' collection) were being treated as unauthorized for admin access.

## Solution
Updated the access control configurations for both Users and Universities collections to explicitly allow cross-collection admin access.

### Changes Made

#### 1. Universities Collection (`src/collections/Universities/index.ts`)
Added explicit `admin` access control:

```typescript
access: {
  admin: ({ req: { user } }) => {
    if (!user) return false
    // Allow admin users (from users collection) full access
    if ((user as any).collection === 'users') return true
    // Allow university users (from universities collection) access to admin panel
    if ((user as any).collection === 'universities') return true
    return false
  },
  // ... other access controls
}
```

#### 2. Users Collection (`src/collections/Users/index.ts`)
Modified the `admin` access control to include university users:

```typescript
access: {
  admin: ({ req: { user } }) => {
    if (!user) return false
    // Allow admin users (from users collection) 
    if ((user as any).collection === 'users') return true
    // Allow university users (from universities collection) to access admin panel
    if ((user as any).collection === 'universities') return true
    return false
  },
  // ... other access controls
}
```

## How It Works
1. **Authentication**: University users authenticate through the 'universities' collection (existing functionality)
2. **Admin Access**: The updated access controls allow university users to access the admin panel
3. **Adaptive Interface**: The existing `AdaptiveDashboard` component detects the user type and shows university-specific admin interface
4. **Collection Visibility**: Universities collection remains hidden from university users as intended, while they can access their specific admin features

## Benefits
- University users can now access the admin panel without authorization errors
- Maintains security by preserving collection-specific access controls
- Leverages existing adaptive dashboard for user-type-specific interfaces
- No breaking changes to existing admin user functionality

## Testing
The access control logic has been validated to ensure:
- University users have admin access to both collections
- Admin users retain full access
- Unauthenticated users are properly denied access