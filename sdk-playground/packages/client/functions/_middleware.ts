import { verifyProxyAuth } from 'shared';
import type { Env } from 'shared';
import { AUTH_REQUIRED_HTML, SERVER_ERROR_HTML } from './templates';

type AuthMode = 'enforce' | 'log-only' | 'disabled';

function getAuthMode(request: Request, env: Env): AuthMode {
	const url = new URL(request.url);

	// Check query parameter first (for easy testing)
	const queryMode = url.searchParams.get('proxy_auth');
	if (
		queryMode === 'enforce' ||
		queryMode === 'log-only' ||
		queryMode === 'disabled'
	) {
		return queryMode;
	}

	if (env.PROXY_AUTH_MODE) {
		return env.PROXY_AUTH_MODE;
	}

	return 'log-only';
}

function shouldSkipAuth(request: Request, env: Env): boolean {
	const url = new URL(request.url);

	if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
		return true;
	}

	return false;
}

export async function onRequest(context: {
	request: Request;
	env: Env;
	next: () => Promise<Response>;
}): Promise<Response> {
	const { request, env, next } = context;
	const url = new URL(request.url);

	try {
		const authMode = getAuthMode(request, env);
		console.log(`[Proxy Auth] Mode: ${authMode}, URL: ${url.pathname}`);

		if (shouldSkipAuth(request, env)) {
			console.log('[Proxy Auth] Bypassed for development/testing');
			return await next();
		}

		if (authMode === 'disabled') {
			console.log('[Proxy Auth] Authentication disabled, allowing request');
			return await next();
		}

		const proxyToken = await verifyProxyAuth(request, env);

		if (!proxyToken) {
			console.log('[Proxy Auth] Validation failed - no valid token');

			// In log-only mode, allow the request but log the failure
			if (authMode === 'log-only') {
				console.log(
					'[Proxy Auth] Log-only mode: allowing request despite auth failure',
				);
				return await next();
			}

			console.log('[Proxy Auth] Enforce mode: blocking request');
			return new Response(AUTH_REQUIRED_HTML, {
				status: 401,
				headers: {
					'Content-Type': 'text/html',
					'Cache-Control': 'no-cache, no-store, must-revalidate',
				},
			});
		}

		console.log(
			`[Proxy Auth] Validation success for user ${proxyToken.user_id} (app: ${proxyToken.application_id})`,
		);

		return await next();
	} catch (error) {
		console.error('[Proxy Auth] Middleware error:', error);

		// In log-only mode, allow the request despite errors
		const authMode = getAuthMode(request, env);
		if (authMode === 'log-only') {
			console.log('[Proxy Auth] Log-only mode: allowing request despite error');
			return await next();
		}
		return new Response(SERVER_ERROR_HTML, {
			status: 500,
			headers: {
				'Content-Type': 'text/html',
				'Cache-Control': 'no-cache, no-store, must-revalidate',
			},
		});
	}
}
