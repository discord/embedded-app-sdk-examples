import getActivityInstanceHandler from './handlers/getActivityInstanceHandler';
import iapHandler from './handlers/iapHandler';
import proxyAuthExampleHandler from './handlers/proxyAuthExampleHandler';
import tokenHandler from './handlers/tokenHandler';
import type { Env } from './types';

export function handleApiRequest(path: string[], request: Request, env: Env) {
	// We've received at API request. Route the request based on the path.
	switch (path[0]) {
		case 'token':
			return tokenHandler(path, request, env);
		case 'iap':
			return iapHandler(path, request, env);
		case 'activity-instance':
			return getActivityInstanceHandler(path, request, env);
		case 'proxy-auth-example':
			return proxyAuthExampleHandler(path, request, env);
		default:
			return new Response('Not found', { status: 404 });
	}
}
