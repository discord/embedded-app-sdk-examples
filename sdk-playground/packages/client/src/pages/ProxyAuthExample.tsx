import React from 'react';
import discordSdk from '../discordSdk';
import ReactJsonView from '../components/ReactJsonView';
import {authStore} from '../stores/authStore';

export default function ProxyAuthExample() {
	const [response, setResponse] = React.useState<any | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const auth = authStore();

	const makeProxyRequest = async () => {
		if (!auth) {
			setError('Authentication required');
			return;
		}

		setLoading(true);
		setError(null);
		setResponse(null);

		try {
			const response = await fetch('/api/proxy-auth-example');
			
			if (!response.ok) {
				throw new Error(`Request failed: ${response.status} ${response.statusText}`);
			}
			
			const data = await response.json();
			setResponse(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unknown error occurred');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{padding: 32}}>
			<div>
				<h1>Proxy Auth Example</h1>
				<p>
					This page demonstrates Discord's proxy authentication system for embedded apps.
					The request is authenticated using Discord's proxy headers and verified on the server.
				</p>
				<br />
				
				<button 
					onClick={makeProxyRequest} 
					disabled={loading || !auth}
					style={{
						padding: '10px 20px',
						fontSize: '16px',
						backgroundColor: loading ? '#ccc' : '#5865f2',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: loading ? 'not-allowed' : 'pointer'
					}}
				>
					{loading ? 'Making Request...' : 'Make Proxy Auth Request'}
				</button>

				{!auth && (
					<p style={{color: 'orange', marginTop: 10}}>
						Please authenticate first to use this feature.
					</p>
				)}

				{error && (
					<div style={{marginTop: 20}}>
						<h3 style={{color: 'red'}}>Error:</h3>
						<p style={{color: 'red'}}>{error}</p>
					</div>
				)}

				{response && (
					<div style={{marginTop: 20}}>
						<h3>Proxy Authentication Response:</h3>
						<ReactJsonView src={response} />
					</div>
				)}
			</div>
		</div>
	);
}