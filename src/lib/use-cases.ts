export type Mode = 'encode' | 'decode';
export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export interface UseCase {
  toolSlug: string;
  slug: string;
  toolName: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  initialValue?: string;
  initialMode?: Mode;
  initialAlgorithm?: HashAlgorithm;
  contentHtml: string;
  faq: Array<{ question: string; answer: string }>;
}

const FAKE_SIG = 'abc123_FAKE_SIGNATURE_FOR_DEMO_PURPOSES_ONLY_xyz789';

const AUTH0_TOKEN =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik5FTTFOakkzUlRCQ01EUTRRa0UxUlRRNE9VTTRRekF3UXpoRk1qVTNSRGMxUWtVd01FVXdOUSJ9.eyJpc3MiOiJodHRwczovL2RlbW8tdGVuYW50LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NTQzYTFiMmMzZDRlNWY2Nzg5MDEyMzQiLCJhdWQiOlsiaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20iLCJodHRwczovL2RlbW8tdGVuYW50LnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE3NjEzNzkyMDAsImV4cCI6MTc2MTQ2NTYwMCwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCByZWFkOm9yZGVycyB3cml0ZTpvcmRlcnMiLCJhenAiOiJhM0I3TGMxREtsTU5vUHFSc1R1VndYeVoiLCJwZXJtaXNzaW9ucyI6WyJyZWFkOm9yZGVycyIsIndyaXRlOm9yZGVycyJdfQ.' +
  FAKE_SIG;

const GOOGLE_TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3N2FkOGQ4YTc4YjM0YzhkMmRkNGUzYTNhM2I0YzVkNmU3ZjhhOWIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMjM0NTY3ODktYWJjLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMTIzNDU2Nzg5LWFiYy5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExNDU2Nzg5MDEyMzQ1Njc4OTAxMiIsImVtYWlsIjoiamFuZS5kb2VAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImpLTG04TjNQcXJfU3R1dndYWTEyQXciLCJuYW1lIjoiSmFuZSBEb2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUdObXl4WWNEZW1vMTIzIiwiZ2l2ZW5fbmFtZSI6IkphbmUiLCJmYW1pbHlfbmFtZSI6IkRvZSIsImlhdCI6MTc2MTM3OTIwMCwiZXhwIjoxNzYxMzgyODAwfQ.' +
  FAKE_SIG;

const SUPABASE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYxNDY1NjAwLCJpYXQiOjE3NjEzNzkyMDAsImlzcyI6Imh0dHBzOi8vZGVtb3Byb2plY3Quc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImE4YjFjMmQzLWU0ZjUtNjc4OS1hYmNkLWVmMDEyMzQ1Njc4OSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZnVsbF9uYW1lIjoiRGVtbyBVc2VyIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3NjEzNzkyMDB9XSwic2Vzc2lvbl9pZCI6ImYxZTJkM2M0LWI1YTYtNzg5MC0xMjM0LTU2Nzg5MGFiY2RlZiIsImlzX2Fub255bW91cyI6ZmFsc2V9.' +
  FAKE_SIG;

const COGNITO_TOKEN =
  'eyJraWQiOiJhYmNkZWYwMTIzNDU2Nzg5IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJhMWIyYzNkNC01Njc4LTkwYWItY2RlZi0xMjM0NTY3ODkwYWIiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiIsImVkaXRvcnMiXSwiaXNzIjoiaHR0cHM6Ly9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbS91cy1lYXN0LTFfQWJDZEVmR2hJIiwiY2xpZW50X2lkIjoiN20xMjM0YWJjZGVmZ2hpamtsbW5vcHFyc3QiLCJvcmlnaW5fanRpIjoiZjVlNmQ3YzgtYjlhMC0xMjM0LTU2NzgtOTBhYmNkZWYxMjM0IiwiZXZlbnRfaWQiOiJlMWYyYTNiNC1jNWQ2LWU3ZjgtYTliMC1jMWQyZTNmNGE1YjYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIGVtYWlsIG9wZW5pZCBwcm9maWxlIiwiYXV0aF90aW1lIjoxNzYxMzc5MjAwLCJleHAiOjE3NjE0NjU2MDAsImlhdCI6MTc2MTM3OTIwMCwianRpIjoiajFrMmwzbTQtbjVvNi1wN3E4LXI5czAtdDF1MnYzdzR4NXk2IiwidXNlcm5hbWUiOiJqZG9lQGV4YW1wbGUuY29tIn0.' +
  FAKE_SIG;

const STRIPE_PAYLOAD = JSON.stringify({
  id: 'evt_3PqR4t2eZvKYlo2C0KzD9aBc',
  object: 'event',
  api_version: '2024-09-30.acacia',
  created: 1761379200,
  data: {
    object: {
      id: 'ch_3PqR4t2eZvKYlo2C0AbCdEfG',
      object: 'charge',
      amount: 2999,
      amount_captured: 2999,
      amount_refunded: 0,
      currency: 'usd',
      customer: 'cus_QbRsTuVwXyZ123',
      description: 'Subscription · Pro plan',
      paid: true,
      payment_intent: 'pi_3PqR4t2eZvKYlo2C0HiJkLmN',
      payment_method_details: {
        card: { brand: 'visa', country: 'US', exp_month: 12, exp_year: 2027, last4: '4242', network: 'visa' },
        type: 'card',
      },
      receipt_email: 'jane@example.com',
      status: 'succeeded',
    },
  },
  livemode: false,
  pending_webhooks: 1,
  request: { id: 'req_AbCdEfGhIjKl', idempotency_key: null },
  type: 'charge.succeeded',
});

const GITHUB_PAYLOAD = JSON.stringify({
  ref: 'refs/heads/main',
  before: '0000000000000000000000000000000000000000',
  after: 'f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
  repository: {
    id: 123456789,
    node_id: 'MDEwOlJlcG9zaXRvcnkxMjM0NTY3ODk=',
    name: 'example-repo',
    full_name: 'octocat/example-repo',
    private: false,
    owner: { login: 'octocat', id: 1, type: 'User' },
    html_url: 'https://github.com/octocat/example-repo',
    default_branch: 'main',
  },
  pusher: { name: 'octocat', email: 'octocat@github.com' },
  sender: { login: 'octocat', id: 1, type: 'User' },
  commits: [
    {
      id: 'f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
      message: 'Add CI workflow',
      timestamp: '2026-04-25T12:00:00Z',
      author: { name: 'Octocat', email: 'octocat@github.com' },
      added: ['.github/workflows/ci.yml'],
      removed: [],
      modified: [],
    },
  ],
  head_commit: {
    id: 'f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
    message: 'Add CI workflow',
  },
});

const DISCORD_PAYLOAD = JSON.stringify({
  username: 'DeployBot',
  avatar_url: 'https://example.com/bot-avatar.png',
  content: 'Production deploy succeeded.',
  embeds: [
    {
      title: 'Deployment v2.4.1',
      description: 'All checks passed in 2m 34s.',
      color: 5763719,
      fields: [
        { name: 'Environment', value: 'production', inline: true },
        { name: 'Commit', value: '`f3a4b5c`', inline: true },
        { name: 'Author', value: '@octocat', inline: false },
      ],
      footer: { text: 'DevOps Pipeline', icon_url: 'https://example.com/footer.png' },
      timestamp: '2026-04-25T12:00:00.000Z',
    },
  ],
  allowed_mentions: { parse: ['users'] },
});

const SLACK_PAYLOAD = JSON.stringify({
  token: 'verification_token_xxx',
  team_id: 'T01ABCDEFGH',
  api_app_id: 'A01ABCDEFGH',
  event: {
    type: 'app_mention',
    user: 'U01ABCDEFGH',
    text: '<@U02BOTUSERID> deploy production',
    ts: '1761379200.000100',
    channel: 'C01ABCDEFGH',
    event_ts: '1761379200.000100',
  },
  type: 'event_callback',
  event_id: 'Ev01ABCDEFGH',
  event_time: 1761379200,
  authorizations: [
    { enterprise_id: null, team_id: 'T01ABCDEFGH', user_id: 'U02BOTUSERID', is_bot: true, is_enterprise_install: false },
  ],
});

export const useCases: UseCase[] = [
  // ============ JWT DECODER ============
  {
    toolSlug: 'jwt-decoder',
    slug: 'auth0-token',
    toolName: 'Decode Auth0 JWT Access Tokens',
    description: 'Inspect Auth0 access tokens — view scopes, audience, expiration, and custom permissions instantly.',
    metaTitle: 'Auth0 JWT Decoder — Decode Access Tokens Online | DevToolkit',
    metaDescription: 'Decode Auth0 access tokens in your browser. Inspect iss, aud, scope, permissions, and exp claims without sending the token to any server.',
    initialValue: AUTH0_TOKEN,
    contentHtml: `
    <h2>Why Auth0 Tokens Need Special Inspection</h2>
    <p>Auth0 issues both <strong>ID tokens</strong> and <strong>access tokens</strong>, and the two carry different claims even though they share the same JWT structure. Auth0 access tokens include opaque claims like <code>azp</code> (authorized party), <code>scope</code>, and a <code>permissions</code> array tied to your tenant's RBAC configuration. When debugging "permission denied" errors, the fastest path is to decode the token and confirm exactly which scopes and permissions Auth0 actually issued — not what your app expected to receive.</p>
    <p>This page pre-loads a representative Auth0 access token. Replace it with your own token (everything stays in your browser) to inspect production tokens during incident response.</p>

    <h2>Auth0-Specific Claims You Should Check First</h2>
    <p>Beyond the standard JWT claims, Auth0 adds several namespaced and platform-specific fields. Skim these in order when triaging an auth issue:</p>
    <ul>
      <li><strong><code>iss</code></strong> — Always ends in <code>.auth0.com/</code> (or your custom domain). If the issuer doesn't match the tenant your API expects, you're looking at a token from the wrong tenant.</li>
      <li><strong><code>aud</code></strong> — An array containing your API identifier and (for tokens with the <code>openid</code> scope) the <code>/userinfo</code> endpoint. A missing audience is the #1 cause of <code>403 Forbidden</code> errors.</li>
      <li><strong><code>scope</code></strong> — Space-separated list of OAuth scopes granted at login. Auth0 will silently drop scopes the user wasn't permitted to consent to.</li>
      <li><strong><code>permissions</code></strong> — Array of fine-grained permissions from Auth0's RBAC. Only present if you've enabled "Add Permissions in the Access Token" in API settings.</li>
      <li><strong><code>azp</code></strong> — The Auth0 client ID that obtained the token. Useful when multiple SPAs share the same API.</li>
      <li><strong><code>sub</code></strong> — Format is always <code>auth0|userid</code>, <code>google-oauth2|userid</code>, etc. The prefix tells you which connection authenticated the user.</li>
    </ul>

    <h2>Common Debugging Scenarios</h2>
    <p><strong>"My API returns 401 even though the user just logged in."</strong> Check <code>exp</code> against the current Unix timestamp. Auth0 access tokens default to a 24-hour lifetime but can be configured down to 60 seconds. Also confirm <code>iss</code> exactly matches the issuer your API's middleware is configured to accept — including the trailing slash.</p>
    <p><strong>"Permissions are missing from the token."</strong> Auth0 only includes <code>permissions</code> if both your API has RBAC enabled <em>and</em> "Add Permissions in the Access Token" is toggled on. The setting is per-API, not per-tenant.</p>
    <p><strong>"<code>scope</code> only shows <code>openid profile email</code> but I requested more."</strong> Auth0 silently drops scopes the consent screen wasn't allowed to show. Check Application → APIs → Authorized scopes for the tenant.</p>

    <h2>Related Tools &amp; Reading</h2>
    <ul>
      <li><a href="/tools/jwt-decoder/">Generic JWT Decoder</a> — for non-Auth0 tokens</li>
      <li><a href="/tools/jwt-decoder/google-oauth-token/">Google OAuth ID Token Decoder</a></li>
      <li><a href="/tools/timestamp-converter/">Unix Timestamp Converter</a> — convert <code>iat</code> and <code>exp</code> to readable dates</li>
      <li><a href="/blog/what-is-jwt/">What is a JWT?</a> — structural primer</li>
      <li><a href="/blog/jwt-debugging-guide/">JWT Debugging Guide</a> — step-by-step troubleshooting</li>
    </ul>
    `,
    faq: [
      {
        question: 'Is it safe to paste my real Auth0 token here?',
        answer: 'Yes. The decoder runs entirely in your browser using JavaScript. No part of the token is sent to a server. That said, treat any token you paste as if it could be screen-recorded — never paste production admin tokens on a shared machine.',
      },
      {
        question: 'Why does my Auth0 token not have a permissions array?',
        answer: 'Auth0 only includes the permissions claim when your API has RBAC enabled AND "Add Permissions in the Access Token" is toggled on. Both settings live under Auth0 Dashboard → APIs → [Your API] → RBAC Settings.',
      },
      {
        question: 'Can this verify the Auth0 token signature?',
        answer: 'No. Signature verification requires Auth0\'s JWKS public key, which would mean fetching it from your tenant. This decoder is for inspection only. Production code must verify the signature using a JWT library configured with your tenant\'s JWKS endpoint.',
      },
      {
        question: 'What does the auth0|... prefix in sub mean?',
        answer: 'It identifies the connection that authenticated the user. auth0|... means database connection, google-oauth2|... means Google social login, samlp|... means a SAML enterprise connection, etc. Useful when migrating users between connections.',
      },
      {
        question: 'How long do Auth0 access tokens last?',
        answer: 'The default lifetime is 24 hours (86400 seconds), but it\'s configurable per-API from 60 seconds up to 30 days. Refresh tokens have separate, much longer lifetimes. Always check the exp claim — never assume.',
      },
    ],
  },
  {
    toolSlug: 'jwt-decoder',
    slug: 'google-oauth-token',
    toolName: 'Decode Google OAuth ID Tokens',
    description: 'Decode Google Sign-In ID tokens — verify email, picture, audience, and at_hash claims in your browser.',
    metaTitle: 'Google OAuth Token Decoder — Decode ID Tokens | DevToolkit',
    metaDescription: 'Decode Google OAuth and Sign-In ID tokens online. Inspect aud, iss, email, sub, and at_hash claims with no data leaving your browser.',
    initialValue: GOOGLE_TOKEN,
    contentHtml: `
    <h2>Google ID Tokens Have Stricter Validation Rules</h2>
    <p>Google's OAuth 2.0 / OpenID Connect implementation issues two distinct token types: an <strong>access token</strong> (an opaque string used to call Google APIs) and an <strong>ID token</strong> (a JWT containing identity claims). When developers say "decode the Google token", they almost always mean the ID token. Decoding the access token won't work — it isn't a JWT at all.</p>
    <p>Google ID tokens carry standardized OIDC claims, plus a few Google-specific ones like <code>at_hash</code> (a partial hash of the access token, used to bind the two tokens together). The decoder here is pre-loaded with a representative Google ID token. Replace it with your own to inspect what Google actually returned to your app.</p>

    <h2>Validation Checklist for Google ID Tokens</h2>
    <p>Per Google's <a href="https://developers.google.com/identity/sign-in/web/backend-auth">official docs</a>, every claim below must validate before you trust the token server-side. The decoder shows them; your code must check them:</p>
    <ul>
      <li><strong><code>iss</code></strong> — Must be exactly <code>https://accounts.google.com</code> or <code>accounts.google.com</code>. Anything else is a forged token.</li>
      <li><strong><code>aud</code></strong> — Must equal your OAuth client ID. If you have multiple clients (web + iOS + Android), each is a separate audience.</li>
      <li><strong><code>azp</code></strong> — The "authorized party". For most apps this equals <code>aud</code>, but for apps with multiple clients, <code>azp</code> identifies the specific client.</li>
      <li><strong><code>exp</code></strong> — Google ID tokens expire 1 hour after issuance. Any longer lifetime is a forgery.</li>
      <li><strong><code>email_verified</code></strong> — Critical. <code>true</code> means Google has verified ownership of the email. Treating an unverified email as authoritative is the #1 OAuth security mistake.</li>
      <li><strong><code>at_hash</code></strong> — A SHA-256 half-hash of the access token, base64url-encoded. Validates that the access token wasn't swapped between services.</li>
      <li><strong><code>hd</code></strong> — Present only for Google Workspace accounts. Equals the user's hosted domain (e.g., <code>example.com</code>). Useful for restricting sign-in to corporate accounts.</li>
    </ul>

    <h2>Common Pitfalls</h2>
    <p><strong>"My token has email but email_verified is false."</strong> This happens when a user signs up with a Google account they haven't confirmed via email. Treat the email as user-claimed, not verified. Don't auto-link accounts on this basis.</p>
    <p><strong>"aud doesn't match my client ID exactly."</strong> Google issues different ID tokens for different OAuth clients in the same project. Confirm you're comparing against the right client ID — web vs iOS vs Android each have unique IDs.</p>
    <p><strong>"The token is decoded but I can't verify the signature."</strong> Google rotates their JWKS keys frequently. Your verification library must fetch <code>https://www.googleapis.com/oauth2/v3/certs</code> on each verification (or cache with TTL).</p>

    <h2>Related Resources</h2>
    <ul>
      <li><a href="/tools/jwt-decoder/">Generic JWT Decoder</a></li>
      <li><a href="/tools/jwt-decoder/auth0-token/">Auth0 JWT Decoder</a></li>
      <li><a href="/tools/timestamp-converter/">Unix Timestamp Converter</a> — convert <code>iat</code> and <code>exp</code></li>
      <li><a href="/blog/what-is-jwt/">What is a JWT?</a></li>
    </ul>
    `,
    faq: [
      {
        question: 'My Google token won\'t decode — is something wrong?',
        answer: 'Make sure you pasted the ID token, not the access token. Google access tokens are opaque strings (e.g., starting with ya29.) and are not JWTs. Only the ID token has the three-part structure.',
      },
      {
        question: 'Why does email_verified matter?',
        answer: 'Treating an unverified Google email as if Google had verified it is a classic account-takeover vector. If a user signed up with someone else\'s email and never confirmed it, email_verified will be false. Block sign-in or require additional verification in that case.',
      },
      {
        question: 'How do I verify the at_hash claim?',
        answer: 'Take the access token, hash it with the algorithm declared in the ID token header (typically SHA-256), keep the left half of the bytes, and base64url-encode. The result must equal at_hash. Mismatch means the access token was swapped.',
      },
      {
        question: 'How long does a Google ID token last?',
        answer: 'Exactly 3600 seconds (1 hour) from iat. Refresh by exchanging the refresh token for a new access + ID token pair. Google does not extend ID token lifetimes.',
      },
      {
        question: 'Can I trust the picture URL claim?',
        answer: 'Yes for the URL itself — Google issues it. But the underlying image is hosted on Google\'s CDN and could change or be removed. Don\'t hot-link it in critical UI; cache it server-side.',
      },
    ],
  },
  {
    toolSlug: 'jwt-decoder',
    slug: 'supabase-jwt',
    toolName: 'Decode Supabase JWT Tokens',
    description: 'Inspect Supabase auth tokens — verify role, session_id, app_metadata, and aal claims for RLS debugging.',
    metaTitle: 'Supabase JWT Decoder — Inspect Auth Tokens | DevToolkit',
    metaDescription: 'Decode Supabase JWT tokens online. Inspect role, app_metadata, user_metadata, aal, and session_id claims with no data leaving your browser.',
    initialValue: SUPABASE_TOKEN,
    contentHtml: `
    <h2>Why Supabase Tokens Are Different</h2>
    <p>Supabase issues HMAC-SHA256 signed JWTs (HS256) by default — not the asymmetric RS256 most other identity providers use. The signing secret is your project's <code>SUPABASE_JWT_SECRET</code>, which is shared between your Postgres database and your application. Your Postgres Row Level Security (RLS) policies decode the token directly inside SQL using <code>auth.jwt()</code>, which makes Supabase JWTs uniquely intertwined with your database schema.</p>
    <p>This pre-loaded sample token is a typical Supabase access token for an authenticated user. Replace it with your own to debug RLS failures, role mismatches, or session inconsistencies.</p>

    <h2>Supabase-Specific Claims and What They Mean</h2>
    <ul>
      <li><strong><code>role</code></strong> — Either <code>authenticated</code> (logged-in user), <code>anon</code> (anonymous public access), or <code>service_role</code> (full admin, never exposed to clients). Postgres RLS policies branch on this.</li>
      <li><strong><code>aud</code></strong> — Always <code>authenticated</code> for user tokens. RLS uses this implicitly.</li>
      <li><strong><code>iss</code></strong> — Format <code>https://&lt;project-ref&gt;.supabase.co/auth/v1</code>. Verify this matches your project before trusting the token.</li>
      <li><strong><code>sub</code></strong> — The user's UUID. This is the same value as <code>auth.users.id</code> in your database. RLS policies typically check <code>auth.uid() = user_id</code>.</li>
      <li><strong><code>app_metadata</code></strong> — Server-controlled metadata. Users cannot modify this. Use it for plan tier, internal flags, etc.</li>
      <li><strong><code>user_metadata</code></strong> — User-controlled metadata. Users <em>can</em> modify this via <code>updateUser()</code>. Never trust it for authorization.</li>
      <li><strong><code>aal</code></strong> — Authenticator Assurance Level. <code>aal1</code> = single-factor, <code>aal2</code> = MFA verified. Critical for sensitive operations.</li>
      <li><strong><code>session_id</code></strong> — Allows server-side session revocation. Storing this lets you invalidate a specific session without rotating the JWT secret.</li>
      <li><strong><code>amr</code></strong> — Array of authentication methods used. Includes <code>password</code>, <code>oauth</code>, <code>otp</code>, <code>totp</code>, etc.</li>
      <li><strong><code>is_anonymous</code></strong> — <code>true</code> for guest sessions created via <code>signInAnonymously()</code>. Always check this before granting privileged actions.</li>
    </ul>

    <h2>Debugging Row Level Security with the Token</h2>
    <p><strong>"My RLS policy denies a user that should have access."</strong> Decode the token, then run <code>SELECT auth.jwt()</code> in the SQL editor as that user. The decoded values must match what your policy expects. The most common bug: a policy checks <code>app_metadata-&gt;&gt;'plan' = 'pro'</code> but the field is actually in <code>user_metadata</code> (which users can fake) — or vice versa.</p>
    <p><strong>"Anonymous user is being treated as authenticated."</strong> Check <code>is_anonymous</code>. RLS policies should explicitly handle this — anonymous tokens still have <code>role=authenticated</code>, which is intentional but easy to miss.</p>
    <p><strong>"MFA isn't enforced."</strong> Sensitive policies should check <code>aal = 'aal2'</code>, not just <code>role = 'authenticated'</code>. Otherwise a single-factor login bypasses MFA.</p>

    <h2>Related Tools</h2>
    <ul>
      <li><a href="/tools/jwt-decoder/">Generic JWT Decoder</a></li>
      <li><a href="/tools/jwt-decoder/auth0-token/">Auth0 JWT Decoder</a></li>
      <li><a href="/tools/timestamp-converter/">Unix Timestamp Converter</a></li>
      <li><a href="/tools/uuid-generator/">UUID Generator</a> — generate new sub UUIDs for testing</li>
    </ul>
    `,
    faq: [
      {
        question: 'Is it safe to decode my real Supabase token here?',
        answer: 'Decoding is safe — it happens entirely in your browser. However, anyone who has your access token can call your Supabase API as that user until the token expires. Don\'t paste tokens from production admin sessions on shared machines.',
      },
      {
        question: 'Why does role say "authenticated" for an anonymous user?',
        answer: 'Supabase deliberately issues role=authenticated even for anonymous sessions so existing RLS policies continue to work. Distinguish anonymous users by checking the is_anonymous claim, not role.',
      },
      {
        question: 'Can I trust user_metadata in an RLS policy?',
        answer: 'No. Users can write to user_metadata via the JS client. Only use app_metadata for authorization decisions. app_metadata is read-only from the client side and only writable via the service_role key.',
      },
      {
        question: 'How long do Supabase access tokens last?',
        answer: 'Default is 3600 seconds (1 hour). Configurable in Auth → Settings → JWT expiry limit, with a maximum of 7 days. Refresh tokens are used to obtain new access tokens after expiry.',
      },
      {
        question: 'Why does my decoded payload look different from what auth.jwt() returns in SQL?',
        answer: 'Supabase\'s Postgres functions add an additional aud check and may filter certain claims. The browser decoder shows the raw JWT payload; auth.jwt() returns it after Supabase\'s server-side validation.',
      },
    ],
  },
  {
    toolSlug: 'jwt-decoder',
    slug: 'aws-cognito-jwt',
    toolName: 'Decode AWS Cognito JWT Tokens',
    description: 'Inspect AWS Cognito access and ID tokens — view cognito:groups, token_use, scope, and client_id claims.',
    metaTitle: 'AWS Cognito JWT Decoder — Inspect Tokens Online | DevToolkit',
    metaDescription: 'Decode AWS Cognito JWT access and ID tokens. Inspect cognito:groups, token_use, scope, and client_id claims locally in your browser.',
    initialValue: COGNITO_TOKEN,
    contentHtml: `
    <h2>Cognito Issues Three Token Types — Know Which One You Have</h2>
    <p>AWS Cognito user pools issue <strong>three</strong> distinct tokens at sign-in: an ID token (identity claims), an access token (API authorization), and a refresh token (opaque, used to renew the other two). The first two are JWTs; the refresh token is an opaque string. The decoder here works on either JWT — just paste it and inspect the claims.</p>
    <p>The single most important claim to check first is <code>token_use</code>. It's either <code>id</code> or <code>access</code>. Confirm you're sending the right type to the right endpoint — Cognito's User Info endpoint requires the access token, while your app's authentication needs the ID token.</p>

    <h2>Cognito-Specific Claims</h2>
    <ul>
      <li><strong><code>token_use</code></strong> — <code>id</code> or <code>access</code>. Always confirm before passing the token to a downstream service.</li>
      <li><strong><code>iss</code></strong> — Format <code>https://cognito-idp.&lt;region&gt;.amazonaws.com/&lt;userPoolId&gt;</code>. The user pool ID is embedded — verify it matches your expected pool.</li>
      <li><strong><code>client_id</code></strong> (access token) — The Cognito app client that obtained the token. If you have multiple app clients (web + mobile + admin), each issues tokens with a different <code>client_id</code>.</li>
      <li><strong><code>aud</code></strong> (ID token only) — Equals the app client ID. Only present in ID tokens, not access tokens.</li>
      <li><strong><code>sub</code></strong> — The user's immutable UUID. Use this as the foreign key in your database, not <code>username</code> or <code>email</code> (both can change).</li>
      <li><strong><code>cognito:groups</code></strong> — Array of group names the user belongs to. Maps to your IAM roles via Cognito Identity Pools or custom logic.</li>
      <li><strong><code>cognito:username</code></strong> — The user's pool-level username. Often the email, but configurable per-pool.</li>
      <li><strong><code>scope</code></strong> (access token) — Space-separated list of OAuth scopes. <code>aws.cognito.signin.user.admin</code> grants self-service operations like password change.</li>
      <li><strong><code>auth_time</code></strong> — When the user actually authenticated. Distinct from <code>iat</code>, which is when the token was issued (could be after a refresh).</li>
      <li><strong><code>jti</code></strong> — Unique token ID. Stored in your database to allow per-token revocation.</li>
    </ul>

    <h2>Common Cognito Debugging Scenarios</h2>
    <p><strong>"My API Gateway authorizer rejects the token."</strong> API Gateway by default validates <code>token_use=access</code>. If you're sending an ID token, the authorizer rejects it even though the signature is valid. Switch the client to send the access token instead.</p>
    <p><strong>"I can't see custom attributes."</strong> Cognito custom attributes appear with the <code>custom:</code> prefix (e.g., <code>custom:tenant_id</code>). They're only included in ID tokens by default. Access tokens require explicit configuration to include custom attributes (and only post-OAuth 2.0 token customization, available since 2024).</p>
    <p><strong>"cognito:groups is missing."</strong> The user isn't in any group. Confirm via Cognito Console → User Pools → Users → [User] → Groups, or by querying the AdminListGroupsForUser API.</p>

    <h2>Related Tools</h2>
    <ul>
      <li><a href="/tools/jwt-decoder/">Generic JWT Decoder</a></li>
      <li><a href="/tools/jwt-decoder/auth0-token/">Auth0 JWT Decoder</a></li>
      <li><a href="/tools/jwt-decoder/google-oauth-token/">Google OAuth Decoder</a></li>
      <li><a href="/tools/uuid-generator/">UUID Generator</a></li>
    </ul>
    `,
    faq: [
      {
        question: 'What\'s the difference between Cognito ID and access tokens?',
        answer: 'ID tokens carry user identity claims (email, name, custom attributes) and are meant for the application itself. Access tokens carry authorization scopes and are meant for API authorization. Use ID tokens to identify the user; use access tokens to call protected APIs.',
      },
      {
        question: 'Can I decode the refresh token?',
        answer: 'No. Cognito refresh tokens are opaque strings, not JWTs. They have no decodable structure — they\'re only meaningful to the Cognito service. Only the access and ID tokens can be decoded here.',
      },
      {
        question: 'Why does my access token not have an email claim?',
        answer: 'Cognito access tokens by default contain only authorization claims, not identity claims. Email lives in the ID token. Some apps configure access token customization (a 2024 feature) to add identity claims, but this is opt-in.',
      },
      {
        question: 'How do I verify a Cognito JWT signature?',
        answer: 'Fetch the JWKS from https://cognito-idp.<region>.amazonaws.com/<userPoolId>/.well-known/jwks.json, find the key with the matching kid in the token header, and verify the RS256 signature. Most JWT libraries handle this when given the JWKS URL.',
      },
      {
        question: 'How long do Cognito tokens last?',
        answer: 'Default is 1 hour for access and ID tokens, 30 days for refresh tokens. All three are configurable per app client (access/ID: 5 minutes to 1 day; refresh: 60 minutes to 10 years).',
      },
    ],
  },

  // ============ JSON FORMATTER ============
  {
    toolSlug: 'json-formatter',
    slug: 'stripe-webhook',
    toolName: 'Stripe Webhook JSON Formatter',
    description: 'Format and inspect Stripe webhook payloads — auto-pretty-print events like charge.succeeded, invoice.paid, and customer.subscription.updated.',
    metaTitle: 'Stripe Webhook Formatter — Pretty-Print Payloads | DevToolkit',
    metaDescription: 'Format Stripe webhook event JSON in your browser. Pre-loaded with a real charge.succeeded sample. Inspect the data object, payment_method_details, and more.',
    initialValue: STRIPE_PAYLOAD,
    contentHtml: `
    <h2>Why Stripe Webhooks Need Their Own Formatting Workflow</h2>
    <p>Stripe webhooks are the source of truth for billing, subscription, and payment lifecycle events — but their raw JSON arrives minified, with the actual event data buried two levels deep inside <code>data.object</code>. When debugging a failed deploy or unexpected charge, you need a fast way to format and visually scan the payload. This page is pre-loaded with a representative <code>charge.succeeded</code> event so you can see the structure immediately. Replace it with your own captured webhook payload (from your application logs or the Stripe Dashboard's Events log) to inspect what Stripe actually sent.</p>

    <h2>The Anatomy of a Stripe Event</h2>
    <p>Every Stripe webhook follows the same envelope structure. Knowing the layout cuts debug time:</p>
    <ul>
      <li><strong><code>id</code></strong> — Event ID, format <code>evt_...</code>. Useful for idempotency: if your handler has already processed this event ID, skip it.</li>
      <li><strong><code>type</code></strong> — The event type, e.g., <code>charge.succeeded</code>, <code>invoice.payment_failed</code>, <code>customer.subscription.updated</code>. Branch your handler logic on this.</li>
      <li><strong><code>api_version</code></strong> — The Stripe API version pinned to your webhook endpoint. Critical when migrating versions — the schema of <code>data.object</code> may change.</li>
      <li><strong><code>data.object</code></strong> — The actual resource (Charge, Invoice, Subscription, etc.). This is what you care about 90% of the time.</li>
      <li><strong><code>data.previous_attributes</code></strong> — Only present on <code>*.updated</code> events. Shows the field values before the update, so you can detect what actually changed.</li>
      <li><strong><code>livemode</code></strong> — <code>true</code> for live events, <code>false</code> for test mode. Always log this — running test handlers against live data is a classic mistake.</li>
      <li><strong><code>request.idempotency_key</code></strong> — Set if the original API call used an idempotency key. Helps trace which user action triggered the event.</li>
    </ul>

    <h2>Common Stripe Webhook Debugging Tasks</h2>
    <p><strong>"Why did this charge succeed but not update the subscription?"</strong> A successful charge fires <code>charge.succeeded</code>, but the subscription isn't extended until <code>invoice.payment_succeeded</code> fires (or <code>invoice.paid</code> on newer API versions). Check that both events are being processed.</p>
    <p><strong>"Did the user upgrade their plan?"</strong> Look at <code>customer.subscription.updated</code> with <code>data.previous_attributes.items</code> set. Diff against <code>data.object.items</code> to see what changed.</p>
    <p><strong>"What card was charged?"</strong> <code>data.object.payment_method_details.card</code> contains <code>brand</code>, <code>last4</code>, and <code>country</code>. Never log the full card number — Stripe doesn't send it, and PCI compliance forbids storing it.</p>

    <h2>Verifying Webhook Authenticity</h2>
    <p>Pretty-printing the JSON is just the first step. Production handlers must verify the <code>Stripe-Signature</code> header before trusting the payload. Stripe signs the raw request body with HMAC-SHA256 using your endpoint's signing secret. Verify with the official Stripe libraries, or read the algorithm at <a href="https://docs.stripe.com/webhooks/signatures">Stripe's docs</a>. Don't roll your own verifier — timing-safe comparison is easy to get wrong.</p>

    <h2>Related Tools</h2>
    <ul>
      <li><a href="/tools/json-formatter/">Generic JSON Formatter</a></li>
      <li><a href="/tools/json-formatter/github-webhook/">GitHub Webhook Formatter</a></li>
      <li><a href="/tools/json-validator/">JSON Validator</a></li>
      <li><a href="/tools/timestamp-converter/">Unix Timestamp Converter</a> — for the <code>created</code> field</li>
      <li><a href="/tools/hash-generator/">Hash Generator</a> — for HMAC-SHA256 signature verification</li>
    </ul>
    `,
    faq: [
      {
        question: 'Where does Stripe put the actual payment data in a webhook?',
        answer: 'Inside data.object. The outer envelope (id, type, livemode) is metadata about the event itself. The resource that triggered the event (the Charge, Invoice, Subscription, etc.) is always at data.object.',
      },
      {
        question: 'How do I tell if a Stripe webhook is from test or live mode?',
        answer: 'Check the livemode boolean. true = live, false = test. Live and test events use different signing secrets, so you should also have separate webhook endpoints in your application for each.',
      },
      {
        question: 'Why does my webhook event have data.previous_attributes?',
        answer: 'previous_attributes only appears on update events (anything ending in .updated). It shows the values of fields before the change. Diff against data.object to identify exactly what was modified.',
      },
      {
        question: 'Should I trust this raw webhook JSON?',
        answer: 'Only after verifying the Stripe-Signature header. Anyone can POST to your webhook URL — the signature header is what proves the payload came from Stripe. Verify before reading the body in production code.',
      },
      {
        question: 'Why are amounts in cents instead of dollars?',
        answer: 'Stripe represents all currency amounts in the smallest unit (cents for USD, satang for THB, etc.). Divide by 100 for USD, EUR, GBP. Some currencies (JPY, KRW, VND) have no minor unit, so the value is already in the major unit — check Stripe\'s zero-decimal currency list.',
      },
    ],
  },
  {
    toolSlug: 'json-formatter',
    slug: 'github-webhook',
    toolName: 'GitHub Webhook JSON Formatter',
    description: 'Format and inspect GitHub webhook payloads — auto-pretty-print push, pull_request, issues, and workflow_run events.',
    metaTitle: 'GitHub Webhook Formatter — Format Payloads Online | DevToolkit',
    metaDescription: 'Pretty-print GitHub webhook JSON in your browser. Pre-loaded with a real push event sample. Inspect commits, repository, sender, and head_commit fields.',
    initialValue: GITHUB_PAYLOAD,
    contentHtml: `
    <h2>GitHub Webhooks Are the Backbone of CI/CD</h2>
    <p>Every push, PR, issue comment, and workflow run can fire a webhook. The payloads are deeply nested — a single <code>pull_request</code> event can be 50KB+ of JSON — and you'll spend a lot of time scanning them while debugging GitHub Actions, Probot apps, or Slack/Discord notifiers. This page is pre-loaded with a representative <code>push</code> event so you can see the canonical structure. Replace it with your own captured payload (from <code>github.event</code> in Actions logs, your webhook receiver's logs, or the GitHub UI's "Recent Deliveries" tab).</p>

    <h2>The Three Levels of Every GitHub Event</h2>
    <p>Most webhook payloads share a three-level shape:</p>
    <ul>
      <li><strong>Event-specific top-level fields</strong> — For <code>push</code>: <code>ref</code>, <code>before</code>, <code>after</code>, <code>commits[]</code>, <code>head_commit</code>. For <code>pull_request</code>: <code>action</code>, <code>number</code>, <code>pull_request</code> object. For <code>issues</code>: <code>action</code>, <code>issue</code>. The <code>action</code> field on <code>*.{opened,closed,edited,...}</code> events is what you switch on in your handler.</li>
      <li><strong><code>repository</code></strong> — The repo where the event happened. Always present. <code>full_name</code>, <code>owner.login</code>, <code>default_branch</code>, <code>private</code> are the most-used fields.</li>
      <li><strong><code>sender</code></strong> — The user who triggered the event. <code>login</code>, <code>id</code>, <code>type</code> (User vs Bot vs Organization). For automated events, <code>type=Bot</code>.</li>
    </ul>

    <h2>Common GitHub Webhook Tasks</h2>
    <p><strong>"Did this push happen on the default branch?"</strong> Compare <code>ref</code> (e.g., <code>refs/heads/main</code>) against <code>repository.default_branch</code> (e.g., <code>main</code>). The <code>ref</code> includes the <code>refs/heads/</code> prefix; the default branch doesn't.</p>
    <p><strong>"Was this a force push?"</strong> Check the <code>forced</code> boolean on the push event. <code>true</code> means git history was rewritten — flag it loudly in your security tooling.</p>
    <p><strong>"Who actually opened this PR?"</strong> Use <code>pull_request.user.login</code>, not <code>sender.login</code>. The sender of a <code>pull_request.opened</code> event is the same person, but for <code>pull_request.synchronize</code> (new commits pushed), <code>sender</code> is the pusher while <code>pull_request.user</code> is the original PR author.</p>
    <p><strong>"What files changed in this push?"</strong> Walk <code>commits[].added</code>, <code>commits[].removed</code>, and <code>commits[].modified</code> arrays. For pushes with more than 20 commits, GitHub truncates the array — fall back to the Compare API (<code>compare</code> URL).</p>

    <h2>Verifying GitHub Signatures</h2>
    <p>GitHub signs every webhook with HMAC-SHA256 using your webhook secret. The signature lives in the <code>X-Hub-Signature-256</code> header. Verify it before parsing the body in production. Use a constant-time comparison — string equality is vulnerable to timing attacks.</p>

    <h2>Related Tools</h2>
    <ul>
      <li><a href="/tools/json-formatter/">Generic JSON Formatter</a></li>
      <li><a href="/tools/json-formatter/stripe-webhook/">Stripe Webhook Formatter</a></li>
      <li><a href="/tools/json-formatter/discord-webhook/">Discord Webhook Formatter</a></li>
      <li><a href="/tools/hash-generator/">Hash Generator</a> — for HMAC-SHA256 signature verification</li>
    </ul>
    `,
    faq: [
      {
        question: 'Where can I find a real GitHub webhook payload to test with?',
        answer: 'Three places: (1) Settings → Webhooks → [your webhook] → Recent Deliveries on any GitHub repo. (2) The github.event context in any GitHub Actions log. (3) The webhooks page of your custom GitHub App.',
      },
      {
        question: 'Why is the commits array sometimes empty?',
        answer: 'For deletion events (deleted=true) or branch creation without new commits. Also for pushes that contain only merge commits with no new file changes — though usually the array has at least the merge commit.',
      },
      {
        question: 'How do I distinguish a fork PR from a same-repo PR?',
        answer: 'Compare pull_request.head.repo.full_name to pull_request.base.repo.full_name. If they differ, it\'s from a fork — important for security since fork PRs run with restricted GITHUB_TOKEN permissions.',
      },
      {
        question: 'What does the "type" field on sender mean?',
        answer: 'User, Bot, or Organization. Bot covers GitHub Apps and built-in automations like dependabot. Filter on type=User if you only want human-triggered events.',
      },
      {
        question: 'Are all GitHub webhook events JSON?',
        answer: 'Yes, for the JSON content-type (the default). GitHub also supports application/x-www-form-urlencoded, but only legacy integrations use it. You can configure the format per-webhook in repo settings.',
      },
    ],
  },
  {
    toolSlug: 'json-formatter',
    slug: 'discord-webhook',
    toolName: 'Discord Webhook JSON Formatter',
    description: 'Format and validate Discord webhook payloads — pretty-print embeds, fields, allowed_mentions, and component arrays.',
    metaTitle: 'Discord Webhook JSON Formatter & Validator | DevToolkit',
    metaDescription: 'Format Discord webhook JSON in your browser. Pre-loaded with an embed sample. Inspect embeds, fields, allowed_mentions, and component structures.',
    initialValue: DISCORD_PAYLOAD,
    contentHtml: `
    <h2>Discord Webhooks Are JSON, But Not Quite Like Other Webhooks</h2>
    <p>Discord webhooks are <em>outbound</em> — your code POSTs JSON to a Discord URL, and Discord renders it as a message in a channel. Unlike Stripe or GitHub webhooks (which Discord receives), here you're crafting the payload. The schema is well-defined but easy to get wrong: a single misplaced field silently breaks the embed without any error response. This page is pre-loaded with a typical embed-with-fields payload so you can see the canonical shape. Adjust it, copy the formatted output, and POST to your Discord webhook URL.</p>

    <h2>The Three Layers of a Discord Webhook Payload</h2>
    <ul>
      <li><strong>Top-level message fields</strong> — <code>content</code> (plain text, max 2000 chars), <code>username</code> (overrides the webhook's default name per-message), <code>avatar_url</code>, <code>tts</code> (text-to-speech), and <code>allowed_mentions</code> (which mentions actually ping users).</li>
      <li><strong><code>embeds[]</code></strong> — Up to 10 embed objects per message, with strict character limits (title 256, description 4096, total embed payload 6000). Each embed has <code>title</code>, <code>description</code>, <code>color</code> (decimal RGB), <code>fields[]</code> (max 25), <code>author</code>, <code>footer</code>, <code>timestamp</code>, <code>thumbnail</code>, <code>image</code>, <code>url</code>.</li>
      <li><strong><code>components[]</code></strong> — Interactive elements (buttons, select menus). Webhooks can include components, but only if the webhook is owned by your application — generic webhooks reject component arrays.</li>
    </ul>

    <h2>The "color" Trap</h2>
    <p>The <code>color</code> field on an embed must be a <strong>decimal integer</strong>, not a hex string. A common mistake: passing <code>"#5865F2"</code> or <code>0x5865F2</code> as a string. Discord ignores the field. Convert hex to decimal: <code>0x5865F2</code> = <code>5793266</code>, <code>0x57F287</code> = <code>5763719</code> (Discord green), <code>0xED4245</code> = <code>15548997</code> (Discord red). Most languages have a built-in for this — in JavaScript, <code>parseInt("5865F2", 16)</code>.</p>

    <h2>Common Discord Webhook Bugs</h2>
    <p><strong>"My @everyone mention isn't pinging anyone."</strong> By default, Discord webhooks suppress <code>@everyone</code> and <code>@here</code> pings. To enable, set <code>"allowed_mentions": {"parse": ["everyone"]}</code>. Use sparingly — channel members can mute the webhook if it's noisy.</p>
    <p><strong>"My embed timestamp is showing as 'just now' even for old events."</strong> The <code>timestamp</code> field must be ISO 8601 (e.g., <code>2026-04-25T12:00:00.000Z</code>). Unix timestamps don't work — Discord falls back to the message creation time.</p>
    <p><strong>"My fields aren't lining up."</strong> <code>inline: true</code> arranges fields in columns, but Discord auto-wraps to a new row every 3 inline fields on desktop and every 2 on mobile. Mix inline and non-inline strategically.</p>
    <p><strong>"I'm hitting rate limits."</strong> Discord webhooks: 5 requests per 2 seconds per webhook URL. For higher throughput, batch updates into a single message with multiple embeds (max 10).</p>

    <h2>Related Tools</h2>
    <ul>
      <li><a href="/tools/json-formatter/">Generic JSON Formatter</a></li>
      <li><a href="/tools/json-formatter/slack-webhook/">Slack Webhook Formatter</a></li>
      <li><a href="/tools/json-validator/">JSON Validator</a> — catch syntax errors before POSTing</li>
      <li><a href="/tools/color-converter/">HEX to RGB Color Converter</a> — convert hex to decimal for the color field</li>
    </ul>
    `,
    faq: [
      {
        question: 'Why does Discord ignore my embed color?',
        answer: 'The color field must be a decimal integer, not a hex string. "#FF0000" or "0xFF0000" are silently ignored. Use 16711680 (decimal for FF0000) instead. Convert hex with parseInt(hex, 16) in JavaScript.',
      },
      {
        question: 'Can I edit a webhook message after sending?',
        answer: 'Yes, but only if you saved the message ID from the original POST response (with ?wait=true on the URL). PATCH /webhooks/{id}/{token}/messages/{message_id} edits the message. Without the message ID, you can\'t.',
      },
      {
        question: 'What\'s the limit on embed fields?',
        answer: 'Each embed: 25 fields max, title 256 chars, description 4096 chars, field name 256, field value 1024, footer 2048. Total characters across an embed: 6000. Per message: up to 10 embeds.',
      },
      {
        question: 'Why does my mention not actually ping the user?',
        answer: 'Two reasons. (1) The mention syntax must be <@USER_ID>, not @username. (2) Discord webhooks default to suppressing all mentions. Set allowed_mentions.parse to ["users"] (or specific user IDs) to enable.',
      },
      {
        question: 'How do I send a file with the webhook?',
        answer: 'Use multipart/form-data instead of application/json. Send the JSON payload as a "payload_json" form field and the file as a separate "file" field. Pure JSON requests can\'t carry binary attachments.',
      },
    ],
  },
  {
    toolSlug: 'json-formatter',
    slug: 'slack-webhook',
    toolName: 'Slack Webhook & Event JSON Formatter',
    description: 'Format Slack webhook payloads, Block Kit messages, and Events API JSON — pretty-print and validate against Slack\'s schemas.',
    metaTitle: 'Slack Webhook JSON Formatter — Block Kit & Events | DevToolkit',
    metaDescription: 'Format Slack webhook JSON, Block Kit message payloads, and Events API events in your browser. Pre-loaded with an app_mention sample.',
    initialValue: SLACK_PAYLOAD,
    contentHtml: `
    <h2>Slack Has Three Different "Webhook" Formats</h2>
    <p>The word "Slack webhook" is overloaded. There are three distinct payload types, and they don't share a schema:</p>
    <ul>
      <li><strong>Incoming Webhooks</strong> — You POST JSON to a Slack URL to send a message. Schema: <code>text</code>, <code>blocks[]</code>, <code>attachments[]</code>.</li>
      <li><strong>Events API</strong> — Slack POSTs JSON to your URL when something happens in a workspace. Schema: <code>event_callback</code> wrapper with the actual event nested in <code>event</code>.</li>
      <li><strong>Slash commands &amp; Interactive components</strong> — Slack POSTs <code>application/x-www-form-urlencoded</code> with a JSON-encoded <code>payload</code> field. Different schema again.</li>
    </ul>
    <p>This page is pre-loaded with an <strong>Events API</strong> payload (an <code>app_mention</code> event) — the most common one developers debug. Replace it with your own captured payload to validate the structure.</p>

    <h2>The Events API Envelope</h2>
    <p>Every Events API payload has the same outer envelope:</p>
    <ul>
      <li><strong><code>type</code></strong> — Always <code>event_callback</code> for actual events. <code>url_verification</code> appears once during initial endpoint setup; respond by echoing back the <code>challenge</code> field.</li>
      <li><strong><code>token</code></strong> — Verification token. Deprecated for new apps; modern apps verify the <code>X-Slack-Signature</code> header instead.</li>
      <li><strong><code>team_id</code></strong> — The workspace where the event happened.</li>
      <li><strong><code>api_app_id</code></strong> — Your Slack app's ID. Useful when one server handles webhooks for multiple apps.</li>
      <li><strong><code>event</code></strong> — The actual event object. Its schema depends on <code>event.type</code> (<code>message</code>, <code>app_mention</code>, <code>reaction_added</code>, etc.).</li>
      <li><strong><code>event_id</code></strong> — Unique ID for idempotency. Slack retries failed deliveries up to 3 times — store and check this ID.</li>
      <li><strong><code>event_time</code></strong> — Unix timestamp of the event. Distinct from <code>event.ts</code>, which is the message timestamp.</li>
    </ul>

    <h2>Block Kit: Slack's Rich Message Format</h2>
    <p>Modern Slack messages use <strong>Block Kit</strong> — an array of <code>blocks</code>, each with a <code>type</code> (<code>section</code>, <code>divider</code>, <code>actions</code>, <code>image</code>, <code>context</code>, etc.). Block Kit replaced the older <code>attachments</code> field, which still works but is deprecated for new development. When debugging an "interactive button doesn't fire", confirm the block has an <code>action_id</code> and your endpoint handles the <code>block_actions</code> interactive payload type.</p>

    <h2>Common Slack Webhook Bugs</h2>
    <p><strong>"My event endpoint URL won't verify."</strong> Slack sends a <code>url_verification</code> challenge first. Your endpoint must respond within 3 seconds with <code>{ "challenge": "..." }</code> echoed back. A 200 with the wrong body fails verification.</p>
    <p><strong>"I'm getting duplicate events."</strong> Slack retries failed deliveries (anything other than 2xx) up to 3 times within an hour. Use <code>event_id</code> for idempotency.</p>
    <p><strong>"My bot can't see messages it should see."</strong> The bot's OAuth scopes determine what events it receives. <code>message.channels</code> only fires for public channels the bot is in; <code>message.groups</code> for private channels; <code>message.im</code> for DMs. Each is a separate scope.</p>

    <h2>Related Tools</h2>
    <ul>
      <li><a href="/tools/json-formatter/">Generic JSON Formatter</a></li>
      <li><a href="/tools/json-formatter/discord-webhook/">Discord Webhook Formatter</a></li>
      <li><a href="/tools/hash-generator/">Hash Generator</a> — for X-Slack-Signature HMAC verification</li>
      <li><a href="/tools/timestamp-converter/">Unix Timestamp Converter</a> — for <code>event_time</code></li>
    </ul>
    `,
    faq: [
      {
        question: 'How do I tell if a payload is from Events API or an Incoming Webhook?',
        answer: 'Direction. Events API: Slack → your server (you receive). Incoming Webhook: your server → Slack (you send). They have completely different schemas. The Events API always has type=event_callback at the top level.',
      },
      {
        question: 'How do I verify a Slack request is authentic?',
        answer: 'Slack signs every request with HMAC-SHA256 using your signing secret. Compute v0=HMAC(timestamp+":"+raw_body) and compare to the X-Slack-Signature header. Reject requests where the timestamp is more than 5 minutes old (replay protection).',
      },
      {
        question: 'Why do I keep getting the same event twice?',
        answer: 'Slack retries failed deliveries (anything other than 2xx within 3 seconds) up to 3 times. Make your handler idempotent by storing event_id values you\'ve already processed for ~1 hour.',
      },
      {
        question: 'What\'s the difference between event.ts and event_time?',
        answer: 'event_time is the Unix timestamp of when the event happened. event.ts is the Slack message timestamp (a higher-precision string like "1761379200.000100"). Use event.ts as the unique message ID — it doubles as the timestamp and the message reference.',
      },
      {
        question: 'Are blocks and attachments the same?',
        answer: 'No. blocks is the modern Block Kit format. attachments is the legacy "secondary attachments" format. Both work, but blocks is preferred for new code. You can mix them, but Slack will style attachments as visually subordinate.',
      },
    ],
  },

  // ============ BASE64 ============
  {
    toolSlug: 'base64',
    slug: 'basic-auth',
    toolName: 'Base64 Encoder for HTTP Basic Auth',
    description: 'Encode "username:password" to Base64 for the Authorization: Basic HTTP header — generate Basic Auth credentials in your browser.',
    metaTitle: 'Basic Auth Base64 Encoder — Authorization Header | DevToolkit',
    metaDescription: 'Generate HTTP Basic Auth credentials in your browser. Encode username:password to the format the Authorization: Basic header expects.',
    initialValue: 'admin:secret-password-123',
    initialMode: 'encode',
    contentHtml: `
    <h2>How HTTP Basic Auth Actually Works</h2>
    <p>HTTP Basic Authentication is the simplest auth scheme defined in RFC 7617: take a username and password, join them with a colon, Base64-encode the result, and send it in the <code>Authorization: Basic &lt;encoded&gt;</code> header. That's the entire protocol. The pre-loaded value above (<code>admin:secret-password-123</code>) shows the input format. Click <strong>Encode</strong> to see the Base64 output that goes into your header — for that input, <code>YWRtaW46c2VjcmV0LXBhc3N3b3JkLTEyMw==</code>.</p>

    <h2>The Format Is Strict — Get It Wrong and Auth Silently Fails</h2>
    <ul>
      <li><strong>Single colon separator.</strong> If your password contains a colon, you must escape it or use a different auth scheme. Basic Auth has no escaping mechanism — the first colon wins.</li>
      <li><strong>UTF-8 encoding.</strong> The pre-encoding string should be UTF-8 bytes, not Latin-1. Most servers handle this correctly, but mismatches cause "wrong password" errors with Unicode passwords.</li>
      <li><strong>Standard Base64, not URL-safe.</strong> Use <code>+</code> and <code>/</code>, not <code>-</code> and <code>_</code>. The <code>=</code> padding must be included.</li>
      <li><strong>No newlines in the output.</strong> Some encoders wrap Base64 at 64 characters. Strip all whitespace before putting the value in the header.</li>
    </ul>

    <h2>The Final HTTP Header</h2>
    <p>Once you have the Base64 string, the full header is:</p>
    <pre><code>Authorization: Basic YWRtaW46c2VjcmV0LXBhc3N3b3JkLTEyMw==</code></pre>
    <p>Note the literal word <code>Basic</code> followed by a single space, then the encoded value. <code>curl</code> handles this automatically with <code>-u username:password</code> — useful for confirming your manually-encoded value matches what curl produces.</p>

    <h2>Security Caveats</h2>
    <p><strong>Basic Auth is not encryption.</strong> Base64 is encoding, not hashing. Anyone who captures the header can recover the original password instantly. <strong>Always use Basic Auth over HTTPS</strong> — never over plain HTTP. Even over HTTPS, it's worth thinking twice: every request carries the password, so any server-side logging of full headers leaks credentials.</p>
    <p><strong>Prefer API tokens or OAuth where possible.</strong> Basic Auth is fine for personal scripts hitting your own API, server-to-server calls in a private network, and dev environments. Production user-facing auth should use sessions (with httpOnly cookies) or OAuth bearer tokens.</p>

    <h2>Common Use Cases for Basic Auth Today</h2>
    <ul>
      <li>Calling private package registries (npm, PyPI, Docker Hub) — they accept Basic Auth with a username and access token.</li>
      <li>GitHub API access via Personal Access Tokens (legacy — fine-grained tokens are now preferred).</li>
      <li>Internal admin endpoints behind a VPN.</li>
      <li>Webhook verification when the receiver expects pre-shared credentials.</li>
    </ul>

    <h2>Related Tools</h2>
    <ul>
      <li><a href="/tools/base64/">Generic Base64 Encoder/Decoder</a></li>
      <li><a href="/tools/hash-generator/">Hash Generator</a> — for stronger auth schemes (HMAC, SHA-256)</li>
      <li><a href="/tools/url-encoder/">URL Encoder</a></li>
      <li><a href="/tools/jwt-decoder/">JWT Decoder</a> — for Bearer token auth</li>
    </ul>
    `,
    faq: [
      {
        question: 'Is Base64 encoding the same as encryption?',
        answer: 'No. Base64 is reversible encoding with no key — anyone who has the encoded string can decode it back to the original. Always use HTTPS to protect the password in transit; Base64 alone provides zero confidentiality.',
      },
      {
        question: 'What if my password contains a colon?',
        answer: 'Basic Auth has no escaping mechanism, so the password cannot contain a colon. The first colon in the input always splits username from password. Either change the password or use a different auth scheme.',
      },
      {
        question: 'Why does my server reject the Authorization header?',
        answer: 'Common causes: (1) extra whitespace inside the Base64 string, (2) missing "=" padding, (3) wrong character set (URL-safe instead of standard Base64), (4) Latin-1 encoding instead of UTF-8 for non-ASCII characters. The encoder here produces RFC 7617-compliant output.',
      },
      {
        question: 'How do I send Basic Auth with curl?',
        answer: 'Use the -u flag: curl -u admin:secret-password-123 https://example.com/api. Curl handles the Base64 encoding and Authorization header automatically. Useful for confirming your manually-encoded header matches.',
      },
      {
        question: 'Can I decode the Authorization header to recover the password?',
        answer: 'Yes — that\'s exactly why Basic Auth must run over HTTPS. Switch this tool to "Decode" mode and paste the Base64 part of an Authorization: Basic header to recover username:password. This is also why you must never log full request headers.',
      },
    ],
  },

  // ============ HASH GENERATOR ============
  {
    toolSlug: 'hash-generator',
    slug: 'sha256-file-integrity',
    toolName: 'SHA-256 Generator for File Integrity',
    description: 'Generate SHA-256 hashes for file integrity verification — compare downloads against publisher-supplied checksums in your browser.',
    metaTitle: 'SHA-256 Hash Generator — File Integrity Check | DevToolkit',
    metaDescription: 'Generate SHA-256 checksums for file integrity verification. Compare against publisher-supplied hashes to confirm a download wasn\'t tampered with.',
    initialValue: 'paste-file-content-or-text-here',
    initialAlgorithm: 'SHA-256',
    contentHtml: `
    <h2>What File Integrity Hashing Actually Verifies</h2>
    <p>When you download a binary — a Linux ISO, a Docker image, a release tarball — the publisher typically provides a <strong>SHA-256 checksum</strong> alongside the download. The hash is a 64-character hex string like <code>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code>. You compute the same hash on your downloaded copy. If both match, the file you have is bit-for-bit identical to what the publisher built. If they differ — even by one byte — the file was modified somewhere between the publisher and you.</p>
    <p>SHA-256 is the modern standard. SHA-1 has known collision attacks (found in 2017) and is no longer trustworthy for security purposes. MD5 has been broken for over a decade. <strong>If a publisher only provides MD5 or SHA-1, treat their integrity guarantees as advisory at best.</strong></p>

    <h2>How to Verify a Download</h2>
    <ol>
      <li>Download the file.</li>
      <li>Generate its SHA-256. On macOS/Linux: <code>shasum -a 256 filename</code>. On Windows PowerShell: <code>Get-FileHash filename -Algorithm SHA256</code>. Or paste the file's text content into the tool above for small text files.</li>
      <li>Compare the result against the publisher's published checksum. They should be identical, character-for-character.</li>
      <li>Verify the published checksum itself is authentic — typically by checking the publisher's GPG signature on the checksums file. Otherwise an attacker who modified the binary can also modify the displayed checksum.</li>
    </ol>

    <h2>What Hash Mismatches Actually Mean</h2>
    <p><strong>Hashes don't match.</strong> Three possibilities, in order of likelihood:</p>
    <ul>
      <li><strong>Incomplete download.</strong> The file was cut off mid-transfer. Re-download. (Most common cause.)</li>
      <li><strong>Wrong file or version.</strong> You downloaded a different release or platform variant than the checksum is for. Confirm the filename matches the checksum file's row.</li>
      <li><strong>Tampering.</strong> A man-in-the-middle, compromised mirror, or compromised publisher has substituted a malicious file. Rare, but the entire point of integrity checking is to catch this.</li>
    </ul>
    <p>If the hash matches, you've confirmed bit-level integrity. You have <em>not</em> confirmed the publisher is trustworthy — only that the file is what they intended to ship. Authenticity (who built it) requires a signature, not a hash.</p>

    <h2>SHA-256 vs SHA-512 vs Blake3</h2>
    <p>SHA-256 is the de facto standard for software integrity in 2026. SHA-512 produces a longer hash (128 hex chars) and is slightly faster on 64-bit CPUs but offers no meaningful security advantage for integrity checking. Blake3 is faster still but isn't yet universally supported by tooling. Stick with SHA-256 unless you have a specific reason to choose otherwise.</p>

    <h2>Related Tools &amp; Reading</h2>
    <ul>
      <li><a href="/tools/hash-generator/">Generic Hash Generator</a> — MD5, SHA-1, SHA-256, SHA-512</li>
      <li><a href="/compare/sha256-vs-sha512/">SHA-256 vs SHA-512 Comparison</a></li>
      <li><a href="/blog/what-is-hashing/">What is Hashing? MD5, SHA-256 Explained</a></li>
      <li><a href="/blog/sha256-vs-md5/">SHA-256 vs MD5 — Why MD5 Is Broken</a></li>
    </ul>
    `,
    faq: [
      {
        question: 'Can I hash a binary file with this tool?',
        answer: 'Not directly — this tool hashes text input. For binary files, use shasum -a 256 (macOS/Linux) or Get-FileHash (PowerShell) on the file directly. The tool here is best for verifying small text-content hashes or quickly hashing strings during development.',
      },
      {
        question: 'Why do publishers use SHA-256 instead of SHA-1 or MD5?',
        answer: 'Both SHA-1 and MD5 are cryptographically broken. Researchers can construct two different files with the same MD5 hash (since 2004) or SHA-1 hash (since 2017). SHA-256 has no known collision attacks and is the current secure standard.',
      },
      {
        question: 'Does a matching hash prove the publisher is trustworthy?',
        answer: 'No. A matching hash only proves the file is bit-identical to what the publisher claims. It does not prove the publisher is who they say. For authenticity, you need a cryptographic signature (GPG, Sigstore, etc.) that ties the hash to a verified identity.',
      },
      {
        question: 'What if my download\'s hash doesn\'t match?',
        answer: 'Most likely cause: incomplete download. Re-download from the same source and rehash. If still mismatched, try a different mirror. If multiple mirrors disagree, treat it as a potential supply-chain attack and report it to the publisher before running the file.',
      },
      {
        question: 'Are SHA-256 hashes reversible?',
        answer: 'No. Hashing is one-way by design. Given a SHA-256 hash, you cannot recover the original input. This is what makes hashes useful for integrity (detect changes) and password storage (store the hash, never the password). Encoding (Base64) is reversible; hashing is not.',
      },
    ],
  },
];
