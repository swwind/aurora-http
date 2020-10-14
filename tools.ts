import KContext from "./context.ts";
import { KMiddleware, KNext } from "./middleware.ts";

export const compose = <R, S>(mws: KMiddleware<R, S>[]): KMiddleware<R, S> => {
  return async (ctx: KContext<R, S>, next: KNext) => {
    let n = 0;
    async function nxt() {
      if (n === mws.length) {
        await next();
        return;
      }
      if (n > mws.length) {
        throw new Error("next() called too many times");
      }
      const mw = mws[n++];
      await mw(ctx, nxt);
    }
    await nxt();
  };
};
