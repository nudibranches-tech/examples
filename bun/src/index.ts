import type { ClientError, TokenEndpointResponse } from "openid-client";
import { buildAuthorizationUrl, getTokens } from "./auth";
import { $ } from "bun";

const tokenPromise = new Promise<TokenEndpointResponse>(async (resolve, reject) => {
  const { authorizationUrl, codeVerifier, state } = await buildAuthorizationUrl();
  console.log(`Open the URL to authenticate: ${authorizationUrl}`);
  prompt("Press any key to open the URL");
  await $`xdg-open ${authorizationUrl}`;

  const server = Bun.serve({
    hostname: "localhost",
    port: 3000,
    routes: {
      "/auth/callback": async (req) => {
        const tokens = await getTokens(new URL(req.url), codeVerifier, state).catch((e: ClientError) => {
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

const tokens = await tokenPromise;

const response = await fetch(
  `https://bifrost.localhost:8443/87fadb6c-8b76-4c27-8b88-8074faa6ee58/openapi/tpch/tiny/orders?__limit=10`,
  {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  }
);
const json = await response.json();
console.log(json);
