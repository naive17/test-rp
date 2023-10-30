import proxyflare from "@flaregun-net/proxyflare-for-pages"


type MetaTagInjectorInput = {
  name : string,
  description : string,
  image : string,
  embed : boolean,
  url : string
};

class MetaTagInjector {
  private input: MetaTagInjectorInput;
  
  constructor(
    input: MetaTagInjectorInput
  ) {
    this.input = input;
  }
  
  escapeString(s: string) {
    const lookup = {
      "&": "&amp;",
      '"': "&quot;",
      "'": "&#39;",
      "<": "&lt;",
      ">": "&gt;",
    };
    return s.replace(/[&"'<>]/g, (c) => lookup[c]);
  }
  
  element(element) {

    if (element.getAttribute('property') === 'og:url') {
      element.setAttribute('content',this.input.url || '');
    }
    if (element.getAttribute('property') === 'og:title') {
        element.setAttribute('content', 'Dverso | '+this.input.name  || '');
    }
    if (element.getAttribute('property') === 'og:description') {
      element.setAttribute('content', this.input.description || '');
    }
    if (element.getAttribute('property') === 'og:image') {
      element.setAttribute('content', this.input.image || '');
    }
    
    if (element.getAttribute('name') === 'twitter:title') {
      element.setAttribute('content', 'Dverso | '+this.input.name || '');
    }
    if (element.getAttribute('name') === 'twitter:description') {
      element.setAttribute('content', this.input.description || '');
    }
    if (element.getAttribute('name') === 'twitter:image') {
      element.setAttribute('content', this.input.image);
    }
  }
}

async function addHeader(next : any){
  let response = await next();
  response.headers.append("Origin-Agent-Cluster", "?1");
  return response;
}

const routes: Route[] = [{
  from: {
    pattern: "https://test-rp.pages.dev/tos",
    alsoMatchWWWSubdomain: true,
  },
  to: { url: "https://dverso.notion.site/Terms-of-Service-a8eb09346c31468ba0879a5da89fa4d8" },
},
{
  from: {
    pattern: "https://test-rp.pages.dev/_assets",
    alsoMatchWWWSubdomain: true,
  },
  to: { url: "https://dverso.notion.site/_assets" },
},
{
  from: {
    pattern: "/privacy-policy",
    alsoMatchWWWSubdomain: true,
  },
  to: { url: "https://dverso.notion.site/Privacy-Policy-a62e8115e30646d497616912a73e41c0" },
}];
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
/*

export const onRequestGet: PagesFunction<{}> = async ({
  request,
  env,
  next,
}) => {
  try{
    const url = new URL(request.url);
    if (/^\/map\/([^\/]+)$/.test(url.pathname)) {
      
      let alias = url.pathname.split("/")[2];
      if (alias == undefined){
        alias = 'home';
      }
      let data : {
        success? : boolean,
        name? : string,
        description? : string,
        image? : string,
        embed : boolean,
        url? : string
      } = { success : false};
     
      data = await fetch("https://api.dverso.io/api/maps/og/"+alias).then((res) => res.json());
      requestsTimestamps.set(alias, { timestamp: Date.now(), data });
      
      if (data.success == false){
        return await addHeader(next)
      }
      data.url = request.url;
      request.headers.append("Origin-Agent-Cluster", "?1");
      let response = new HTMLRewriter()
                  .on("*", new MetaTagInjector(data))
                  .transform(await next());
      response.headers.append("Origin-Agent-Cluster", "?1");
      return response;
    }else{
      return await addHeader(next)
    }
  }catch(e){
    return await addHeader(next)
  }
  
};*/