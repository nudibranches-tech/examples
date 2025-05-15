/**
 * Client Credentials Flow Code example
 */
import * as client from "openid-client";
import { issuerConfiguration, SCOPE } from ".";

export function clientCredentialsFlow(): Promise<client.TokenEndpointResponse & client.TokenEndpointResponseHelpers> {
  return client.clientCredentialsGrant(issuerConfiguration, { SCOPE });
}
