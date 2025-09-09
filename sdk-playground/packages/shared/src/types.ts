export interface Env {
	ENVIRONMENT: 'dev' | 'staging' | 'production';
	VITE_CLIENT_ID: string;
	CLIENT_SECRET: string;
	BOT_TOKEN: string;
	PUBLIC_KEY: string;
	VITE_DISCORD_API_BASE: string;
	CF_ACCESS_CLIENT_ID?: string;
	CF_ACCESS_CLIENT_SECRET?: string;
	PROXY_AUTH_MODE?: 'enforce' | 'log-only' | 'disabled';
}

export interface ProxyToken {
	application_id: string;
	user_id: string;
	is_developer: boolean;
	created_at: number;
	expires_at: number;
}
