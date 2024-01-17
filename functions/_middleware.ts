import proxyflare from "@flaregun-net/proxyflare-for-pages"

const routes: Route[] = [
  {
    from: {
      pattern: "https://viadeicondotti.store/*",
      alsoMatchWWWSubdomain: true,
    },
    to: { url: "https://www.1-7.it/vdc" },
  },
]
// `PagesFunction` is from @cloudflare/workers-types
export const onRequest: PagesFunction[] = [
  (context) =>
    proxyflare({
      config: {
        global: { debug: true },
        routes,
      },
    })(context),
  // other Pages plugins and middleware
]