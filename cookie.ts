import { setCookie, getCookies, deleteCookie, Cookie } from "./deps.ts";

class KCookie {
  private headers: Headers;
  cookie: Record<string, string>;
  constructor(req: Headers, res: Headers) {
    this.headers = res;
    this.cookie = getCookies({ headers: req });
  }

  set(cookie: Cookie) {
    setCookie({ headers: this.headers }, cookie);
  }
  remove(name: string) {
    deleteCookie({ headers: this.headers }, name);
  }
  get(name: string, def?: string) {
    return this.cookie[name] ?? def;
  }
}

export default KCookie;
