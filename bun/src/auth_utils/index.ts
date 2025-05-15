import * as client from "openid-client";

const file = Bun.file("./service_account.json");

export const CONFIG: {
  client_id: string;
  client_secret: string;
  issuer: string;
  auth_uri: string;
  token_uri: string;
} = await file.json();
export const SCOPE = "openid";

export const issuerConfiguration = await client.discovery(new URL(CONFIG.issuer), CONFIG.client_id, CONFIG.client_secret);
