import { ServerRequest } from "./deps.ts";

class KRequest<Routes = {}> {
  req: ServerRequest;
  param: Routes = {} as Routes;
  remoteIp: string;
  remotePort: number;
  method: string;
  pathname: string;
  headers: Headers;
  body: { [key: string]: any } = {};
  constructor(req: ServerRequest) {
    this.req = req;

    const remoteAddr = req.conn.remoteAddr as Deno.NetAddr;
    this.remoteIp = remoteAddr.hostname ?? "";
    this.remotePort = remoteAddr.port ?? 0;

    this.method = req.method;
    this.pathname = req.url;
    this.headers = req.headers;
  }

  async parseBody() {
    if (this.req.headers.get('Content-Type') === 'application/json') {
      const decoder = new TextDecoder();
      this.body = JSON.parse(decoder.decode(await Deno.readAll(this.req.body))) as any;
    }
  }
}

export default KRequest;
