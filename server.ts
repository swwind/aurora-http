import KContext from "./context.ts";
import { serve } from "./deps.ts";
import { KMiddleware } from "./middleware.ts";
import KRequest from "./request.ts";
import KResponse from "./response.ts";
import KRouter from "./router.ts";
import { compose } from "./tools.ts";

class KServer<State extends {}> {
  private _middlewares: KMiddleware<any, State>[] = [];
  private _state: State;
  constructor(state: State = {} as State) {
    this._state = state;
  }

  /**
   * Register middleware
   * @param middleware middleware
   */
  use(middleware: KMiddleware<any, State>) {
    this._middlewares.push(middleware);
    return this;
  }

  /**
   * Set default state.
   * You can also set it in constructor.
   * @param state default state
   */
  state(state: State) {
    this._state = state;
    return this;
  }

  /**
   * listen local port
   * @param port port
   */
  async listen(port: number) {
    const server = serve({ port });
    for await (const req of server) {
      const res = new KResponse();
      const reqs = new KRequest(req);
      const ctx = new KContext<any, State>(reqs, res, this._state);
      try {
        await compose(this._middlewares)(ctx, async () => {
          ctx.res.status(404).text(`${ctx.req.method} ${ctx.req.originalPathname} NOT FOUND`);
        });
      } catch (e) {
        console.error(e);
        ctx.res.status(500).text('Server Error');
      }
      try {
        await req.respond(res.toResponse());
      } catch (e) {
        // ignore it
      }
    }
  }

  /**
   * Create a router with same `<State>` type
   */
  createRouter() {
    return new KRouter<State>();
  }
}

export default KServer;
