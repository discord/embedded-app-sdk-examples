// HTML templates for error pages
export const AUTH_REQUIRED_HTML = `<!DOCTYPE html>
<html>
<head>
	<title>Discord Authentication Required</title>
	<style>
		body { 
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			max-width: 600px; 
			margin: 100px auto; 
			padding: 20px;
			text-align: center;
		}
		.error { color: #f04747; }
		.info { color: #5865f2; margin-top: 20px; }
	</style>
</head>
<body>
	<h1 class="error">🔒 Discord Authentication Required</h1>
	<p>This application requires Discord proxy authentication.</p>
	<p>Please access this app through Discord's embedded app system.</p>
	<p class="info">Add <code>?proxy_auth=log-only</code> to bypass auth for testing.</p>
</body>
</html>`;

export const SERVER_ERROR_HTML = `<!DOCTYPE html>
<html>
<head>
	<title>Server Error</title>
	<style>
		body { 
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			max-width: 600px; 
			margin: 100px auto; 
			padding: 20px;
			text-align: center;
		}
		.error { color: #f04747; }
	</style>
</head>
<body>
	<h1 class="error">⚠️ Server Error</h1>
	<p>An error occurred while validating authentication.</p>
	<p>Add <code>?proxy_auth=disabled</code> to skip auth for debugging.</p>
</body>
</html>`;