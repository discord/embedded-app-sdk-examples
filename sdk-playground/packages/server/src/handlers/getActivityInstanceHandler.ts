import type { Env, IGetOAuthToken } from '../types';
import { readRequestBody, requestHeaders } from '../utils';

export default async function getActivityInstanceHandler(
	path: string[],
	request: Request,
	env: Env,
) {
	try {
		const instanceId = path[1];
		return await fetch(
			`${env.VITE_DISCORD_API_BASE}/applications/${env.VITE_CLIENT_ID}/activity-instances/${instanceId}`,
			{
				headers: requestHeaders(env),
			},
		);
	} catch (ex) {
		console.error(ex);
		return new Response(`Internal Error: ${ex}`, { status: 500 });
	}
}
