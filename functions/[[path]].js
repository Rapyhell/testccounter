export async function onRequest(context) {
  const { request } = context;
  const response = await context.next();

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  // Rewrite the HTML to inject the absolute request URL with all custom query parameters
  return new HTMLRewriter()
    .on('link[rel="iframely"]', {
      element(element) {
        element.setAttribute('href', request.url);
      }
    })
    .on('meta[property="og:video"]', {
      element(element) {
        element.setAttribute('content', request.url);
      }
    })
    .on('meta[name="twitter:player"]', {
      element(element) {
        element.setAttribute('content', request.url);
      }
    })
    .transform(response);
}
