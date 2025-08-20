#!/bin/bash

# Authentication Fix Verification Script
# Run this after deployment to verify the mutual exclusivity issue is resolved

echo "=== Authentication Fix Verification ==="
echo ""

# Check if the fixes are properly implemented
echo "1. Checking Payload Configuration..."
if grep -q "user: 'users'" src/payload.config.ts; then
    echo "✅ Primary admin collection properly set to 'users'"
else
    echo "❌ ISSUE: Primary admin collection not configured"
fi

if ! grep -q "endpoints: \[adminAuth\]" src/payload.config.ts; then
    echo "✅ Custom admin auth endpoint removed"
else
    echo "❌ ISSUE: Custom admin auth endpoint still registered"
fi

echo ""
echo "2. Checking Authentication Logic..."
if grep -A5 "collection === 'users'" src/auth/adminAuth.ts | grep -q "return true"; then
    echo "✅ Users collection access enabled"
else
    echo "❌ ISSUE: Users collection access not properly configured"
fi

if grep -A5 "collection === 'universities'" src/auth/adminAuth.ts | grep -q "return true"; then
    echo "✅ Universities collection access enabled"
else
    echo "❌ ISSUE: Universities collection access not properly configured"
fi

echo ""
echo "3. Checking Authentication Hook..."
if ! grep -q "user.collection = 'universities'" src/auth/adminAuth.ts; then
    echo "✅ Enhanced beforeLogin hook no longer forces collection assignment"
else
    echo "❌ ISSUE: Enhanced beforeLogin hook still forces collection assignment"
fi

echo ""
echo "4. Checking Endpoint Collection Mapping..."
if grep -A10 "userResult.user" src/endpoints/adminAuth.ts | grep -q "collection: 'users'"; then
    echo "✅ Admin auth endpoint maintains proper collection identity"
else
    echo "❌ ISSUE: Admin auth endpoint still maps collections incorrectly"
fi

echo ""
echo "5. Checking Dashboard Component..."
if [ -f "src/components/AdaptiveDashboard/index.tsx" ]; then
    if grep -q "collection === 'universities'" src/components/AdaptiveDashboard/index.tsx; then
        echo "✅ AdaptiveDashboard properly detects university users"
    else
        echo "❌ ISSUE: AdaptiveDashboard doesn't handle university detection"
    fi
else
    echo "❌ ISSUE: AdaptiveDashboard component missing"
fi

echo ""
echo "=== Configuration Check Complete ==="
echo ""
echo "Verification Steps for Live Testing:"
echo "1. Deploy the changes to your environment"
echo "2. Test admin user login at /admin (Users collection)"
echo "3. Test university user login at /admin (Universities collection)"
echo "4. Verify both can login simultaneously on different devices/sessions"
echo "5. Check that proper dashboards are shown for each user type"
echo ""
echo "Expected Results:"
echo "- Admin users see BeforeDashboard component (standard admin interface)"
echo "- University users see UniversityDashboard component (university-specific interface)"
echo "- No mutual exclusivity - both can work at the same time"
echo "- Proper access controls maintained for each user type"
echo ""
echo "Debug Commands:"
echo "- Check server logs for 'Admin authentication:' messages"
echo "- Verify user.collection values in authentication logs"
echo "- Test /admin access for both user types"