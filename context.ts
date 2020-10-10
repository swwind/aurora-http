import KCookie from "./cookie.ts";
import KRequest from "./request.ts";
import KResponse from "./response.ts";

class KContext<Routes, State> {
  req: KRequest<Routes>;
  res: KResponse;
  state: State;
  cookie: KCookie;
  constructor(req: KRequest<Routes>, res: KResponse, state: State) {
    this.req = req;
    this.res = res;
    this.state = state;
    this.cookie = new KCookie(req.headers, res.headers);
  }
}

export default KContext;
