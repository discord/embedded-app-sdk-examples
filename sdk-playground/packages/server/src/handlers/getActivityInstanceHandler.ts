import { requestHeaders } from '../lib/request';
import type { Env } from '../types';

export default async function getActivityInstanceHandler(
	path: string[],
	_request: Request,
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
