/**
 * Authorization Code Flow Code example
 */
import * as client from "openid-client";
import { issuerConfiguration, SCOPE } from ".";
import { $ } from "bun";

/**
 * Start a web server that listens for response for the authorization code and exchange it with an access token.
 *
 * @returns Promise<client.TokenEndpointResponse>
 */
export function authorizationCodeFlow(): Promise<client.TokenEndpointResponse> {
  return new Promise<client.TokenEndpointResponse>(async (resolve, reject) => {
    const hostname = "localhost";
    const port = 3000;

    // 1. create a web url to request an authorization code
    const { authorizationUrl, codeVerifier, state } = await buildAuthorizationUrl(
      `http://${hostname}:${port}/auth/callback`,
    );
    console.log(`Open the URL to authenticate: ${authorizationUrl}`);
    prompt("Press any key to open the URL");
    await $`xdg-open ${authorizationUrl}`;

    const server = Bun.serve({
      hostname,
      port,
      routes: {
        "/auth/callback": async (req: Bun.BunRequest) => {
          // 2. exchange the authorization code request with an access token
          const tokens = await client
            .authorizationCodeGrant(issuerConfiguration, new URL(req.url), {
              pkceCodeVerifier: codeVerifier,
              expectedState: state,
            })
            .catch((e: client.ClientError) => {
              console.error(`Bad OAuth callback: [${e.code}] ${e.message}`);
              reject(e);
              return null;
            });

          if (tokens === null) {
            return new Response("Authentication failed... 😿", { status: 400 });
          }
          resolve(tokens);
          server.stop();

          return new Response("Authentication successful! 😻 You can close this window.");
        },
      },
    });
  });
}

/**
 * Returns a URL to redirect the user-agent to, in order to request authorization at the Authorization Server.
 *
 * @returns Promise<URL> callback with the authorization code of the user.
 */
async function buildAuthorizationUrl(redirectUri: string): Promise<{
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
  const code_verifier: string = client.randomPKCECodeVerifier();
  const code_challenge: string = await client.calculatePKCECodeChallenge(code_verifier);
  let state!: string;

  const parameters: Record<string, string> = {
    redirect_uri: redirectUri,
    scope: SCOPE,
    code_challenge,
    code_challenge_method: "S256",
  };

  if (!issuerConfiguration.serverMetadata().supportsPKCE()) {
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
    authorizationUrl: client.buildAuthorizationUrl(issuerConfiguration, parameters),
  };
}
