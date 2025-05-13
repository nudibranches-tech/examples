import type { ClientError, TokenEndpointResponse } from "openid-client";
import { buildAuthorizationUrl, getTokens } from "./auth";
import { $ } from "bun";
import { BasicAuth, Trino, type QueryResult } from "trino-client";

// Will trigger example when
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

const tokens = await tokenPromise.catch(() => process.exit());

// HTTP Example
console.log("Request with HTTP:");

const response = await fetch(
  `https://<YOUR_BIFROST_URL>/<YOUR_DATADOCK_ID>/openapi/tpch/tiny/orders?__limit=10`,
  {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  }
);
const json = await response.json();
console.log(json);

// TRINO Example
// TODO JwtAuth not yet available in trino-js-client
// console.log("Request on Trino:");

// const trino = Trino.create({
//   server: "https://hf-87fadb6c-8b76-4c27-8b88-8074faa6ee58.localhost:8443",
//   auth: new JwtAuth(tokens.access_token),
//   ssl: {
//     rejectUnauthorized: false,
//   }
// });

// const iter = await trino.query(`
// SELECT
//   orderkey,
//   custkey,
//   orderstatus,
//   totalprice,
//   orderdate,
//   orderpriority,
//   clerk,
//   shippriority,
//   comment
// FROM
//   tpch.tiny.orders
// LIMIT 10`);

// for await (const queryResult of iter) {
//   console.log(queryResult.data);
// }
