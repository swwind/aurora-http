import { ServerRequest } from "./deps.ts";

class KRequest<Routes = {}> {
  req: ServerRequest;
  param: Routes = {} as Routes;
  remoteIp: string;
  remotePort: number;
  method: string;
  pathname: string;
  query: URLSearchParams;
  headers: Headers;
  body: any = {};
  proto: string;
  protoMajor: number;
  protoMinor: number;
  constructor(req: ServerRequest) {
    this.req = req;

    const remoteAddr = req.conn.remoteAddr as Deno.NetAddr;
    this.remoteIp = remoteAddr.hostname ?? "";
    this.remotePort = remoteAddr.port ?? 0;

    this.method = req.method;
    if (req.url.startsWith('/')) {
      const url = new URL(`http://${req.headers.get('Host')}${req.url}`);
      this.pathname = url.pathname;
      this.query = url.searchParams;
    } else {
      console.log(req.url);
      throw new Error('fuck');
    }
    this.headers = req.headers;
    this.proto = req.proto;
    this.protoMajor = req.protoMajor;
    this.protoMinor = req.protoMinor;
  }

  async parseBody() {
    if (this.req.headers.get("Content-Type") === "application/json") {
      const decoder = new TextDecoder();
      this.body = JSON.parse(
        decoder.decode(await Deno.readAll(this.req.body)),
      ) as any;
    }
  }
}

export default KRequest;
