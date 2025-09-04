import { withProxyAuth } from 'shared';
import type { Env, ProxyToken } from '../types';

async function handleWithProxyAuth(
	proxyToken: ProxyToken,
	path: string[],
	request: Request,
	env: Env,
) {
	return new Response(
		JSON.stringify({
			message: 'Proxy authentication verified successfully',
			user_id: proxyToken.user_id,
			application_id: proxyToken.application_id,
			is_developer: proxyToken.is_developer,
			expires_at: proxyToken.expires_at,
		}),
		{
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
			},
		},
	);
}

export default async function proxyAuthExampleHandler(
	path: string[],
	request: Request,
	env: Env,
) {
	return withProxyAuth(handleWithProxyAuth, request, env, path);
}
