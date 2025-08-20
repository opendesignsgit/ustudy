# Testing Guide for University Admin Access

## Quick Test Instructions

After deploying these changes, university users can test admin access:

### For University Users (e.g., info@bac.edu.my)

1. **Navigate to Admin Panel**
   ```
   Go to: https://your-domain.com/admin
   ```

2. **Login with University Credentials**
   - Email: `info@bac.edu.my` (or your university email)
   - Password: Your university account password

3. **Expected Result**
   - ✅ Should successfully access the admin panel
   - ✅ No "Unauthorized" error message
   - ✅ See admin interface with appropriate collections

4. **Verify Access**
   - Check that you can see Universities collection (if permitted)
   - Verify that restricted collections are hidden appropriately
   - Confirm that your university-specific dashboard still works at `/dashboard`

### For Admin Users (Users Collection)

1. **Test Existing Admin Access**
   ```
   Go to: https://your-domain.com/admin
   ```

2. **Login with Admin Credentials**
   - Use your existing Users collection credentials

3. **Expected Result**
   - ✅ Should maintain full admin access
   - ✅ No disruption to existing workflows
   - ✅ Can see all permitted collections

## Validation Checklist

After deployment, verify:

- [ ] University users can access `/admin` without unauthorized errors
- [ ] University users maintain access to `/dashboard`
- [ ] Admin users from Users collection maintain full access
- [ ] Proper session management (no unexpected logouts)
- [ ] Collection visibility respects existing access controls
- [ ] Authentication logs show successful logins from both collections

## Troubleshooting

### If University Users Still Can't Access Admin:

1. **Check Server Logs**
   - Look for authentication error messages
   - Verify that `admin.user: 'universities'` is active

2. **Verify User Account**
   - Ensure university user exists in Universities collection
   - Confirm account is active (`isActive: true`)
   - Check that email/password are correct

3. **Clear Browser Cache**
   - Clear cookies and local storage
   - Try accessing in incognito/private browsing mode

4. **Check Database Connection**
   - Ensure database is accessible
   - Verify Universities collection exists and has data

### If Users Collection Admin Access Breaks:

1. **Verify Import**
   - Check that `adminAccessControl` is properly imported in Users collection
   - Ensure no typos in import statements

2. **Check Access Control Logic**
   - Verify that Users collection users have `collection: 'users'` property
   - Confirm access control function is called correctly

## Expected Behavior Changes

### Before Fix:
- ❌ University users: "Unauthorized, this user does not have access to the admin panel"
- ✅ Admin users: Full access to admin panel

### After Fix:
- ✅ University users: Full access to admin panel with appropriate permissions
- ✅ Admin users: Continued full access to admin panel

## Support

If issues persist after following this guide:

1. Check the server logs for authentication errors
2. Review the `MULTI_COLLECTION_AUTH_GUIDE.md` for detailed implementation
3. Verify that all code changes were applied correctly
4. Contact development team with specific error messages and logs

---

**Note**: The changes are designed to be backwards-compatible. Existing Users collection admin access should continue working without any modifications to user accounts or workflows.