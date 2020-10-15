import type KContext from "./context.ts";
import { lookup } from "./deps.ts";
import type { KMiddleware, KNext } from "./middleware.ts";

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

const joinPath = (p1: string, p2: string) => {
  if (p1.endsWith('/')) {
    p1 = p1.slice(0, -1);
  }
  if (p2.startsWith('/')) {
    p2 = p2.slice(1);
  }

  return p1 + '/' + p2;
}

export const serve = <R, S> (root: string): KMiddleware<R, S> => {
  return async (ctx, nxt) => {
    if (ctx.req.pathname.endsWith('/')) {
      ctx.req.pathname += 'index.html';
    }
    const filename = joinPath(root, ctx.req.pathname);
    let fileinfo: Deno.FileInfo | null = null;
    try {
      fileinfo = await Deno.stat(filename);
    } catch (e) {
      // pass
    }
    if (fileinfo === null) {
      // ctx.res.status(404).text('404 NOT FOUND');
      await nxt();
      return;
    }

    const file = await Deno.open(filename);
    const range = ctx.req.headers.get('Range');

    if (range?.startsWith('bytes=')) {
      const ranges = range.slice(6).split(',').map((s) => s.trim().split('-').map(Number));
      const total = fileinfo.size;
      if (ranges.length === 1) {
        const [ st, ed ] = ranges[0];
        ctx.res.headers.set('Content-Range', `bytes ${st}-${ed}/${total}`);
        ctx.res.headers.set('Content-Length', String(ed - st + 1));
        file
        ctx.res.status(206).body(file);
      } else {

      }
      return;
    }

    const contentType = lookup(filename);
    if (contentType) {
      ctx.res.headers.set('Content-Type', contentType);
    }
    ctx.res.headers.set('Content-Length', String(fileinfo.size));
    ctx.res.headers.set('Accept-Ranges', 'bytes');
    ctx.res.status(200).body(file);
  }
}

export const vhost = <R, S> (host: string, mw: KMiddleware<R, S>): KMiddleware<R, S> => {
  return async (ctx, nxt) => {
    if (ctx.req.headers.get('Host') === host) {
      await mw(ctx, nxt);
    } else {
      await nxt();
    }
  };
}
