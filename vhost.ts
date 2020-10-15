import type { KMiddleware } from "./middleware.ts";

export const vhost = <R, S> (host: string, mw: KMiddleware<R, S>): KMiddleware<R, S> => {
  return async (ctx, nxt) => {
    if (ctx.req.headers.get('Host') === host) {
      await mw(ctx, nxt);
    } else {
      await nxt();
    }
  };
}
