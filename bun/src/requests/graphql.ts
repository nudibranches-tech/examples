export async function doGraphqlRequest(accessToken: string): Promise<any> {
  const urlHttpStr = prompt(`\
> Enter a GraphQL URL (and needs to end with /graphql):
> Example: https://{bifrost_url}/{datadock_id}/graphql
>`);
  if (urlHttpStr === null) {
    console.error("No URL provided");
    process.exit(1);
  }
  const urlHttp = URL.parse(urlHttpStr);
  if (urlHttp === null || !urlHttpStr.endsWith("/graphql")) {
    console.error("Invalid URL (and needs to end with /graphql)");
    process.exit(1);
  }

  const response = await fetch(urlHttp, {
    method: "POST",
    body: '{"query":"{ tpch { sf300 { orders(limit: 10) { orderkey custkey orderstatus totalprice orderdate orderpriority clerk shippriority comment } } }}"}',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.json();
}
