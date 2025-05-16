import type { ClientError } from "openid-client";
import { doHttpRequest } from "./requests/http";
import { clientCredentialsFlow } from "./auth_utils/client_credentials";
import { doBunPostgresRequest, doPostgresJsRequest } from "./requests/postgres";

// Retrieve access_token
const tokens = await clientCredentialsFlow().catch((e: ClientError) => {
  console.error(e);
  process.exit(1);
});

// Postgres Examples
console.log("\nRequest with Bun postgres driver:");
const bunPgResponse = await doBunPostgresRequest(tokens.access_token);
console.log(bunPgResponse);

console.log("\nRequest with Postgres.js driver:");
const pgJsResponse = await doPostgresJsRequest(tokens.access_token);
console.log(pgJsResponse);

// HTTP Example
console.log("\nRequest with HTTP:");
const httpResponse = await doHttpRequest(tokens.access_token);
console.log(httpResponse);
