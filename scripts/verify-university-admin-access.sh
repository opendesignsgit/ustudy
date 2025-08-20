#!/bin/bash

# University Admin Access Verification Script
# Run this script after deployment to verify the fix is working

echo "=== University Admin Access Verification ==="
echo ""

# Check if the payload config has been fixed
echo "1. Checking Payload Configuration..."
if grep -v "^\s*#\|^\s*//" src/payload.config.ts | grep -q "user: Users.slug"; then
    echo "❌ ISSUE: payload.config.ts still has active 'user: Users.slug' restriction"
    echo "   This needs to be commented out or removed"
    exit 1
else
    echo "✅ Payload config correctly allows multiple collections for admin access"
fi

# Check if Universities collection has proper admin access
echo ""
echo "2. Checking Universities Collection Access..."
if grep -A5 "admin:" src/collections/Universities/index.ts | grep -q "collection === 'universities'"; then
    echo "✅ Universities collection has proper admin access control"
else
    echo "❌ ISSUE: Universities collection missing admin access for universities"
fi

# Check if Users collection has proper admin access
echo ""
echo "3. Checking Users Collection Access..."
if grep -A5 "admin:" src/collections/Users/index.ts | grep -q "collection === 'universities'"; then
    echo "✅ Users collection allows university users admin access"
else
    echo "❌ ISSUE: Users collection doesn't allow university users admin access"
fi

# Check if beforeLogin hook exists and has proper error handling
echo ""
echo "4. Checking University beforeLogin Hook..."
if grep -A10 "beforeLogin:" src/collections/Universities/index.ts | grep -q "isActive === false"; then
    echo "✅ University beforeLogin hook properly handles inactive accounts"
else
    echo "❌ ISSUE: University beforeLogin hook missing or incorrect"
fi

# Check if AdaptiveDashboard component exists
echo ""
echo "5. Checking Adaptive Dashboard Component..."
if [ -f "src/components/AdaptiveDashboard/index.tsx" ]; then
    if grep -q "collection === 'universities'" src/components/AdaptiveDashboard/index.tsx; then
        echo "✅ AdaptiveDashboard properly detects university users"
    else
        echo "❌ ISSUE: AdaptiveDashboard doesn't handle university users"
    fi
else
    echo "❌ ISSUE: AdaptiveDashboard component missing"
fi

echo ""
echo "=== Configuration Check Complete ==="
echo ""
echo "Next Steps:"
echo "1. Deploy the changes to your environment"
echo "2. Test university login at /admin"
echo "3. Verify universities see their custom dashboard"
echo "4. Check server logs for debugging messages"
echo ""
echo "If issues persist:"
echo "- Check server logs for 'University admin login' messages"
echo "- Verify university accounts have isActive: true"
echo "- Ensure database connection is working"