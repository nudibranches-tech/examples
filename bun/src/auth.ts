/**
 * Authorization Code Flow Code example
 */
import * as client from "openid-client";

const file = Bun.file("./service_account.json");

const CONFIG: Config = await file.json();
const REDIRECT_URI = "http://localhost:3000/auth/callback";
const SCOPE = "openid";

type Config = {
  client_id: string;
  client_secret: string;
  issuer: string;
  auth_uri: string;
  token_uri: string;
};

const issuer = await client.discovery(new URL(CONFIG.issuer), CONFIG.client_id, CONFIG.client_secret);

/**
 * Returns a URL to redirect the user-agent to, in order to request authorization at the Authorization Server.
 *
 * @returns Promise<URL> callback with the authorization code of the user.
 */
export async function buildAuthorizationUrl(): Promise<{
  codeVerifier: string;
  state: string;
  authorizationUrl: URL;
}> {
  /**
   * PKCE: The following MUST be generated for every redirect to the
   * authorization_endpoint. You must store the code_verifier and state in the
   * end-user session such that it can be recovered as the user gets redirected
   * from the authorization server back to your application.
   */
  let code_verifier: string = client.randomPKCECodeVerifier();
  let code_challenge: string = await client.calculatePKCECodeChallenge(code_verifier);
  let state!: string;

  let parameters: Record<string, string> = {
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    code_challenge,
    code_challenge_method: "S256",
  };

  if (!issuer.serverMetadata().supportsPKCE()) {
    /**
     * We cannot be sure the server supports PKCE so we're going to use state too.
     * Use of PKCE is backwards compatible even if the AS doesn't support it which
     * is why we're using it regardless. Like PKCE, random state must be generated
     * for every redirect to the authorization_endpoint.
     */
    state = client.randomState();
    parameters.state = state;
  }

  return {
    codeVerifier: code_verifier,
    state,
    authorizationUrl: client.buildAuthorizationUrl(issuer, parameters),
  };
}

export function getTokens(
  currentUrl: URL,
  codeVerifier: string,
  state: string
): Promise<client.TokenEndpointResponse & client.TokenEndpointResponseHelpers> {
  return client.authorizationCodeGrant(issuer, currentUrl, {
    pkceCodeVerifier: codeVerifier,
    expectedState: state,
  });
}
