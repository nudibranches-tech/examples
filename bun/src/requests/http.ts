export async function doHttpRequest(access_token: string): Promise<unknown> {
  const urlHttpStr = prompt(`
> Enter an OpenAPI URL
> Example: https://<bifrost_url>/<datadock_id>/openapi/{catalog}/{schema}/{table}?__limit=10
>`);
  if (urlHttpStr === null) {
    console.error("No URL provided");
    process.exit(1);
  }
  const urlHttp = URL.parse(urlHttpStr);
  if (urlHttp === null) {
    console.error("Invalid URL");
    process.exit(1);
  }

  const response = await fetch(urlHttp, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return response.json();
}
