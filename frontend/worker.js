import { proxyApiRequest } from './functions/api/proxy-core.mjs';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return proxyApiRequest(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};
