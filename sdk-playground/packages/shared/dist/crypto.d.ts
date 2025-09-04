import type { Env, ProxyToken } from './types';
export declare function getSubtleCrypto(): SubtleCrypto;
export declare function verifyProxyAuthHeaders(signatureHeader: string | null, timestampHeader: string | null, payloadHeader: string | null, publicKey: Uint8Array): Promise<ProxyToken | null>;
export declare function verifyProxyAuth(request: Request, env: Env): Promise<ProxyToken | null>;
export declare function withProxyAuth(handler: (proxyToken: ProxyToken, path: string[], request: Request, env: Env) => Promise<Response> | Response, request: Request, env: Env, path: string[]): Promise<Response>;
