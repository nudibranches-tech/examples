import type { ClientError } from "openid-client";
import { authorizationCodeFlow } from "./auth_utils/authorization_code";
import { doHttpRequest } from "./requests/http";

// Retrieve access_token
const tokens = await authorizationCodeFlow().catch((e: ClientError) => {
  console.error(e);
  process.exit(1);
});

// HTTP Example
console.log("\nRequest with HTTP:");
await doHttpRequest(tokens.access_token);
