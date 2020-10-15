import { ServerRequest } from "./deps.ts";

class KRequest<Routes = {}> {
  param: Routes = {} as Routes;
  remote: Deno.NetAddr;
  local: Deno.NetAddr;
  method: string;
  /**
   * Danger!!! This would be changed by KRouter!!!
   * 
   * @seealso  KRequest.originalPathname
   */
  pathname: string;
  originalPathname: string;
  query: URLSearchParams;
  headers: Headers;
  body: any = {};
  proto: string;
  protoMajor: number;
  protoMinor: number;
  _serverRequest: ServerRequest;
  constructor(req: ServerRequest) {
    this.remote = req.conn.remoteAddr as Deno.NetAddr;
    this.local = req.conn.localAddr as Deno.NetAddr;

    this.method = req.method;
    if (req.url.startsWith('/')) {
      const url = new URL(`http://${req.headers.get('Host')}${req.url}`);
      this.pathname = url.pathname;
      this.originalPathname = url.pathname;
      this.query = url.searchParams;
    } else {
      throw new Error('Illegal Request');
    }
    this.headers = req.headers;
    this.proto = req.proto;
    this.protoMajor = req.protoMajor;
    this.protoMinor = req.protoMinor;
    this._serverRequest = req;
  }

  async parseBody() {
    if (this.headers.get("Content-Type") === "application/json") {
      const decoder = new TextDecoder();
      this.body = JSON.parse(
        decoder.decode(await Deno.readAll(this._serverRequest.body)),
      );
    }
  }
}

export default KRequest;
