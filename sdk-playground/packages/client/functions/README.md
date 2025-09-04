# Pages Functions - Proxy Authentication

This directory contains Cloudflare Pages Functions that protect **all static assets** with Discord proxy authentication.

## How It Works

- **`_middleware.ts`** - Runs on EVERY request (HTML, JS, CSS, images, etc.)
- **`lib/crypto.ts`** - Discord proxy auth validation (ported from server)
- **`lib/types.ts`** - TypeScript definitions

## Authentication Modes

### Default: Log-Only Mode
By default, the middleware runs in **log-only** mode for easier testing:
- Validates auth and logs results
- **Always allows requests through** regardless of auth status
- Perfect for development and debugging

### Query Parameter Control
Control auth behavior with `?proxy_auth=<mode>`:

- **`?proxy_auth=log-only`** - Log auth attempts but allow all requests (default)
- **`?proxy_auth=enforce`** - Full authentication enforcement (blocks invalid requests)
- **`?proxy_auth=disabled`** - Skip all auth validation entirely

### Environment Variable
Set `PROXY_AUTH_MODE=enforce|log-only|disabled` in your environment to change the default behavior.

## Authentication Flow

1. User requests any file (e.g., `/`, `/assets/main.js`, etc.)
2. Middleware intercepts the request and determines auth mode
3. Validates Discord proxy auth headers (unless disabled)
4. **Log-only**: Log results and serve file
5. **Enforce**: Block invalid requests with 401 error page
6. **Disabled**: Skip auth entirely

## Development Bypass

Authentication is bypassed entirely when:
- `ENVIRONMENT=dev` (local development)
- Hostname is `localhost` or `127.0.0.1`
- URL contains `?dev=true` query parameter

## Testing Examples

```bash
# Test with log-only (default)
curl https://your-app.pages.dev/

# Test with enforcement
curl https://your-app.pages.dev/?proxy_auth=enforce

# Test with auth disabled
curl https://your-app.pages.dev/?proxy_auth=disabled

# Development bypass
curl https://your-app.pages.dev/?dev=true
```

## Deployment

Functions deploy automatically with existing commands:
```bash
wrangler pages deploy --project-name=sdk-playground dist
```

Cloudflare automatically detects the `/functions` directory and converts it to Workers.

## Enhanced Logging

All auth attempts are logged with detailed information:
```
[Proxy Auth] Mode: log-only, URL: /assets/main.js
[Proxy Auth] Validation failed - no valid token
[Proxy Auth] Log-only mode: allowing request despite auth failure
```

## Security

- **Ed25519 signature verification** using Web Crypto API
- **Token expiration checking** prevents replay attacks
- **Timestamp validation** ensures request freshness
- **Base64 payload decoding** with JSON parsing

All crypto operations work identically to the Workers backend since Pages Functions run on the same Workers runtime.