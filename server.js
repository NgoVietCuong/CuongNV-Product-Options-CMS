const next = require("next");
const jwt = require("jsonwebtoken");
const koa = require("koa");
const axios = require("axios");
const koaRouter = require("koa-router");
const koaSession = require("koa-session");
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const { default: Shopify } = require("@shopify/shopify-api");

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_SCOPES,
  API_VERSION,
  APP_DOMAIN,
  APP_PORT,
  SERVER_URL,
  JWT_ALGORITHM,
  JWT_EXPIRES_IN,
  JWT_SECRET_KEY,
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

const port = parseInt(APP_PORT) || 3000;
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
        const jwtPayLoad = {
          shopDomain: shop,
          accessToken: accessToken
        }
        const jwtSecretKey = JWT_SECRET_KEY;
        const jwtOptions = {
          algorithm: JWT_ALGORITHM,
          expiresIn: JWT_EXPIRES_IN
        }

        const jwtToken =  jwt.sign(jwtPayLoad, jwtSecretKey, jwtOptions);

        ctx.cookies.set("shop", shop, { httpOnly: false, secure: true, sameSite: "none" });
        ctx.cookies.set("accessToken", accessToken, { httpOnly: false, secure: true, sameSite: "none" });
        ctx.cookies.set("jwtToken", jwtToken, { httpOnly: false, secure: true, sameSite: "none" });

        let shopAuthentication = false;

        try {
          const shopRes = await axios({
            url: `${SERVER_URL}/shops`,
            method: "get",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwtToken}`
            }
          });
          const shopData = shopRes.data;

          if (shopData && shopData.statusCode === 200) {
            const shopId = shopData.payload._id;
            ctx.cookies.set('shopId', shopId, { httpOnly: false, secure: true, sameSite: 'none' });
            const updateShopRes = await axios({
              url: `${SERVER_URL}/shops`,
              method: "put",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
              }
            });
            const updateShopData = updateShopRes.data;

            if (updateShopData && updateShopData.statusCode === 200) {
              shopAuthentication = true;
            }
          } else {
            const createShopRes = await axios({
              url: `${SERVER_URL}/shops`,
              method: "post",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
              }
            });
            const createShopData = createShopRes.data;

            if (createShopData && createShopData.statusCode === 201) {
              const shopId = createShopData.payload._id;
              ctx.cookies.set('shopId', shopId, { httpOnly: false, secure: true, sameSite: 'none' });
              const createConfigRes = await axios({
                url: `${SERVER_URL}/configs`,
                method: "post",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${jwtToken}`
                },
                data: {
                  shopId: shopId
                }
              });
              const createConfigData = createConfigRes.data;

              if (createConfigData && createConfigData.statusCode === 201) {
                shopAuthentication = true;
              }
            }
          } 
        } catch (e) {
          console.log('Error', e);
        }

        if (shopAuthentication) {
          console.log("Shop authenticated successfully!");
          ctx.redirect("/");
        }
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
  router.get("(/shared/.*)", handleRequest);
  router.get(
    "(.*)",
    async (ctx, next) => {
      if (ctx.path.includes("/login.html") || ctx.path.includes("/static")) {
        return await handleRequest(ctx);
      }
      await next();
    },
    verifyRequest({ accessMode: "offline", fallbackRoute: "/login.html" }),
    handleRequest,
  );

  server.use(router.allowedMethods()).use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  });
});