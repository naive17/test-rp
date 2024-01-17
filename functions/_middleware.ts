import proxyflare from "@flaregun-net/proxyflare-for-pages"


class LinkRewriter {
  element(element) {
    if (element.hasAttribute("href")) {
      if (element.getAttribute("href").startsWith("https://www.1-7.it/vdc")) {
        element.setAttribute(
          "href",
          element.getAttribute("href").replace("https://www.1-7.it/vdc", "https://viadeicondotti.store")
        )
      }
    }
  }
}

const routes: Route[] = [
  {
    from: {
      pattern: "https://viadeicondotti.store/*",
      alsoMatchWWWSubdomain: true,
    },
    to: { 
      url: "https://www.1-7.it/vdc/",
      "website": {
          "resources": [
            "https://www.1-7.it/vdc/wp-content/*",
            "https://www.1-7.it/vdc/wp-includes/*"
          ]
      }
    },
  },
]
// `PagesFunction` is from @cloudflare/workers-types
export const onRequest: PagesFunction[] = [
  (context) => {
    return proxyflare({
      config: {
        global: { debug: false },
        routes,
      },
    })(context)
  }
  // other Pages plugins and middleware
]