import KRequest from "./request.ts";
import KResponse from "./response.ts";

class KContext<Routes, State> {
  req: KRequest<Routes>;
  res: KResponse;
  state: State;
  constructor(req: KRequest<Routes>, res: KResponse, state: State) {
    this.req = req;
    this.res = res;
    this.state = state;
  }
}

export default KContext;
