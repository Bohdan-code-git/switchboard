import { ConnectionsResponse, OAuthProviderInfo } from '../workspace-api.service';

// Mirrors what the live API reports for each provider, so the sample still shows the real OAuth contract
// when the backend is asleep and its own description is unavailable.
export const SAMPLE_CONTRACTS: OAuthProviderInfo[] = [
  {
    provider: 'google', label: 'Google', configured: true,
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    callbackUri: 'https://switchboard.bogkor906.workers.dev/api/oauth/google/callback',
    responseType: 'code', scopes: ['openid', 'email', 'profile'], pkceMethod: 'S256',
    profileEndpoints: ['https://openidconnect.googleapis.com/v1/userinfo'],
    authorizationParameters: [{ name: 'access_type', value: 'offline' }, { name: 'prompt', value: 'select_account consent' }],
  },
  {
    provider: 'github', label: 'GitHub', configured: true,
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    callbackUri: 'https://switchboard.bogkor906.workers.dev/api/oauth/github/callback',
    responseType: 'code', scopes: ['offline_access'], pkceMethod: 'S256',
    profileEndpoints: ['https://api.github.com/user'],
    authorizationParameters: [{ name: 'allow_signup', value: 'false' }],
  },
  {
    provider: 'discord', label: 'Discord', configured: true,
    authorizationEndpoint: 'https://discord.com/oauth2/authorize',
    tokenEndpoint: 'https://discord.com/api/oauth2/token',
    callbackUri: 'https://switchboard.bogkor906.workers.dev/api/oauth/discord/callback',
    responseType: 'code', scopes: ['identify'], pkceMethod: null,
    profileEndpoints: ['https://discord.com/api/v10/users/@me'],
    authorizationParameters: [{ name: 'prompt', value: 'consent' }],
  },
];

// A made-up person with one healthy grant, one revoked grant and one provider never connected.
export function buildSampleWorkspace(now: number, oauthProviders: OAuthProviderInfo[] = SAMPLE_CONTRACTS): ConnectionsResponse {
  const minutesAgo = (minutes: number) => new Date(now - minutes * 60_000).toISOString();
  const minutesAhead = (minutes: number) => new Date(now + minutes * 60_000).toISOString();
  return {
    demoMode: false,
    generatedAt: new Date(now).toISOString(),
    oauthProviders,
    connections: [
      {
        provider: 'google', label: 'Google', status: 'connected', configured: true,
        profile: { displayName: 'Alex Morgan', identifier: null, email: 'alex.morgan@example.com', avatarUrl: null, profileUrl: null },
        connectedAt: minutesAgo(3 * 24 * 60), lastSyncedAt: minutesAgo(12), accessTokenExpiresAt: minutesAhead(48),
        canRefreshAccessToken: true, grantedScopes: ['openid', 'email', 'profile'], message: null,
      },
      {
        provider: 'github', label: 'GitHub', status: 'reauth_required', configured: true,
        profile: { displayName: 'Alex Morgan', identifier: 'alexmorgan-dev', email: null, avatarUrl: null, profileUrl: null },
        connectedAt: minutesAgo(9 * 24 * 60), lastSyncedAt: minutesAgo(130), accessTokenExpiresAt: null,
        canRefreshAccessToken: false, grantedScopes: [],
        message: 'GitHub answered 401 on the last check: the grant was revoked. Reconnect to restore access.',
      },
      {
        provider: 'discord', label: 'Discord', status: 'not_connected', configured: true,
        profile: null, connectedAt: null, lastSyncedAt: null, accessTokenExpiresAt: null,
        canRefreshAccessToken: false, grantedScopes: [], message: null,
      },
    ],
  };
}
