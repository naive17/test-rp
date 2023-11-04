

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
    //rewrite title
    if (element.tagName === 'title') {
      element.setInnerContent('Dverso | '+this.input.name || '');
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
  response.headers.append("X-Frame-Options", "SAMEORIGIN");
  return response;
}


export const onRequestGet: PagesFunction<{}> = async ({
  request,
  env,
  next,
}) => {
  try{
    const url = new URL(request.url);
    if (/^\/map\/([^\/]+)$/.test(url.pathname) || url.pathname == "/") {
      
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
      
      if (data.success == false){
        return await addHeader(next)
      }
      data.url = request.url;
      new HTMLRewriter()
                  .on("*", new MetaTagInjector(data))
                  .transform(await next());
      return await addHeader(next);
    }else{
      return await addHeader(next)
    }
  }catch(e){
    return await addHeader(next)
  }
};