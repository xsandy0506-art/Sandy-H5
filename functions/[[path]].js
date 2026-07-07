export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 让静态资源通过
  if (
    pathname.startsWith('/assets/') ||
    pathname.match(/\.(js|css|jpg|jpeg|png|gif|svg|mp4|m4a|woff|woff2|ttf|eot)$/)
  ) {
    return context.env.ASSETS.fetch(request);
  }

  // 所有其他请求返回 index.html (SPA路由)
  const indexRequest = new Request(new URL('/index.html', url), {
    method: 'GET',
  });
  return context.env.ASSETS.fetch(indexRequest);
}
