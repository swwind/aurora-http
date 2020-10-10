import { ServerRequest } from "./deps.ts";

class KRequest<Routes = {}, State = {}> {
  req: ServerRequest;
  param: Routes = {} as Routes;
  remoteIp: string;
  remotePort: number;
  method: string;
  pathname: string;
  constructor(req: ServerRequest) {
    this.req = req;

    const remoteAddr = req.conn.remoteAddr as Deno.NetAddr;
    this.remoteIp = remoteAddr.hostname ?? "";
    this.remotePort = remoteAddr.port ?? 0;

    this.method = req.method;
    this.pathname = req.url;
  }
}

export default KRequest;
