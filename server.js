const next = require("next");
const koa = require("koa");
const koaRouter = require("koa-router");
const koaSession = require("koa-session");
const { createShopifyAuth, verifyRequest } = require("simple-koa-shopify-auth");
const { Shopify } = require("@shopify/shopify-api");

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_SCOPES,
  API_VERSION,
  APP_DOMAIN,
  APP_PORT
} = process.env;

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET_KEY,
  SCOPES: SHOPIFY_SCOPES.split(","),
  HOST_NAME: APP_DOMAIN.replace(/^https:\/\//, ""),
  API_VERSION: API_VERSION,
  IS_EMBEDDED_APP: false,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

const port = parseInt(APP_PORT) || 3001;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new koa();
  server.proxy = true;
  server.keys = [SHOPIFY_API_SECRET_KEY];
  const router = new koaRouter();
  
  server.use(koaSession({ sameSite: "none", secure: true }, server));

  server.use(
    createShopifyAuth({
      accessMode: "offline",
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.state.shopify;
        const { host } = ctx.query;
        console.log("shop", shop);
        console.log("accessToken", accessToken);
        ctx.cookies.set("shop", shop, { httpOnly: false, secure: true, sameSite: "none" });
        ctx.cookies.set("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none" });
        ctx.redirect("/");
      }
    })
  )

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  }

  router.get("(/_next/static/.*)", handleRequest);
  router.get("/_next/webpack-hmr", handleRequest);
  router.get(
      "(.*)",
      verifyRequest({ accessMode: "offline", fallbackRoute: "/login.html" }),
      handleRequest,
  );

  server.use(router.allowedMethods()).use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  });
});