export function getSubtleCrypto() {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
        return crypto.subtle;
    }
    throw new Error('No Web Crypto API implementation found');
}
export async function verifyProxyAuthHeaders(signatureHeader, timestampHeader, payloadHeader, publicKey) {
    try {
        if (!signatureHeader || !timestampHeader || !payloadHeader) {
            return null;
        }
        const payloadBuffer = Uint8Array.from(atob(payloadHeader), (c) => c.charCodeAt(0));
        const decoder = new TextDecoder();
        const payloadString = decoder.decode(payloadBuffer);
        const payload = JSON.parse(payloadString);
        if (payload.created_at.toString() !== timestampHeader) {
            return null;
        }
        const signatureBytes = Uint8Array.from(atob(signatureHeader), (c) => c.charCodeAt(0));
        const subtle = getSubtleCrypto();
        const publicKeyObj = await subtle.importKey('raw', publicKey, {
            name: 'Ed25519',
        }, false, ['verify']);
        const isValid = await subtle.verify('Ed25519', publicKeyObj, signatureBytes, payloadBuffer);
        if (!isValid) {
            return null;
        }
        if (payload.expires_at < Math.floor(Date.now() / 1000)) {
            return null;
        }
        return payload;
    }
    catch (error) {
        return null;
    }
}
export async function verifyProxyAuth(request, env) {
    const signatureHeader = request.headers.get('X-Signature-Ed25519');
    const timestampHeader = request.headers.get('X-Signature-Timestamp');
    const payloadHeader = request.headers.get('X-Discord-Proxy-Payload');
    const publicKey = Uint8Array.from(atob(env.PUBLIC_KEY), (c) => c.charCodeAt(0));
    return verifyProxyAuthHeaders(signatureHeader, timestampHeader, payloadHeader, publicKey);
}
export async function withProxyAuth(handler, request, env, path) {
    try {
        const proxyToken = await verifyProxyAuth(request, env);
        if (!proxyToken) {
            return new Response('Unauthorized: Invalid or missing proxy authentication', {
                status: 401,
                headers: { 'Access-Control-Allow-Origin': '*' },
            });
        }
        return await handler(proxyToken, path, request, env);
    }
    catch (error) {
        console.error('Proxy auth middleware error:', error);
        return new Response('Internal Server Error', {
            status: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
        });
    }
}
