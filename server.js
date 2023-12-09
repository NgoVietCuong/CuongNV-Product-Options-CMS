const next = require("next");
const jwt = require("jsonwebtoken");
const koa = require("koa");
const axios = require("axios");
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
      authRoute: "/install/auth",
      async afterAuth(ctx) {
        console.log(ctx.state.shopify)
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

        let shopAuthentication = true;

        try {
          const shopRes = await axios({
            url: `${SERVER_URL}/shops`,
            method: 'get',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${jwtToken}`
            }
          });
          
          console.log(shopRes);
          shopAuthentication = true;
        } catch (error) {
          console.log('error', error);
        }

        if (shopAuthentication) {
          console.log("Shop authenticated successfully!");
          ctx.redirect("/");
        } else {
          console.log('2')
          ctx.redirect("/login.html")
        }
      }
    })
  )

  server.use(async (ctx, next) => {
    console.log(ctx.state.shopify)
    if (!ctx.state.shopify) {
      // Redirect to the login page if not authenticated
      // ctx.redirect('/login');
      // return;
      console.log('khong co');
    } else {
      console.log('co');
    }

    await next();
  });

  router.get('/login', async (ctx) => {
    console.log('cuong yeu hoa')
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  }

  router.get("(/_next/static/.*)", handleRequest);
  router.get("/_next/webpack-hmr", handleRequest);
  router.get(
      "(.*)",
      verifyRequest({ accessMode: "offline", authRoute: "/auth"}),
      handleRequest,
  );

  server.use(router.allowedMethods()).use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  });
});