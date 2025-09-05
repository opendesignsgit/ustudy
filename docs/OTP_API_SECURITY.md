# OTP API Security

## Environment Variables

Add the following to your `.env` file for enhanced security:

```env
INTERNAL_API_TOKEN=your-secure-random-token-here
```

## API Protection

The `/api/send-otp` endpoint is now protected from unauthorized access:

1. **Frontend Protection**: Validates referer header and user-agent to prevent direct API abuse
2. **Internal Token**: Optional secure token for legitimate external usage
3. **Postman/Tools Block**: Blocks common testing tools by user-agent detection

## Usage

### From Frontend (Automatic)
No changes needed - the form automatically includes proper headers

### From External Services (if needed)
```bash
curl -X POST /api/send-otp \
  -H "Content-Type: application/json" \
  -H "x-internal-token: your-secure-token" \
  -d '{"phone": "1234567890"}'
```

## Testing API Security

Try these commands to test protection:

```bash
# This should be blocked (Postman user-agent)
curl -X POST /api/send-otp \
  -H "Content-Type: application/json" \
  -H "User-Agent: Postman/10.0" \
  -d '{"phone": "1234567890"}'

# This should be blocked (no referer)
curl -X POST /api/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "1234567890"}'

# This should work (with internal token)
curl -X POST /api/send-otp \
  -H "Content-Type: application/json" \
  -H "x-internal-token: your-secure-token" \
  -d '{"phone": "1234567890"}'
```