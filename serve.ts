import { lookup } from "./deps.ts";
import type { KMiddleware } from "./middleware.ts";

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
    // console.log('try to find', ctx.req.pathname, 'in', root);
    if (ctx.req.pathname.endsWith('/')) {
      ctx.req.pathname += 'index.html';
    }
    const filename = joinPath(root, decodeURIComponent(ctx.req.pathname));
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
    const range = ctx.req.headers.get('Range');
    const total = fileinfo.size;

    if (range?.startsWith('bytes=')) {
      const ranges = range.slice(6).split(',').map((s) => s.trim().split('-'));
      if (ranges.length !== 1) {
        ctx.res.status(400).text('NOT SUPPORTED');
        return;
      }
      const st = Number(ranges[0][0]);
      let ed = total - 1;
      if (ranges[0][1]) {
        ed = Number(ranges[0][1]);
      }
      if (isNaN(st) || isNaN(ed)) {
        ctx.res.status(400).text('RANGE INVALID');
        return;
      }
      ctx.res.headers.set('Content-Range', `bytes ${st}-${ed}/${total}`);
      ctx.res.headers.set('Content-Length', String(ed - st + 1));
      const buf = await Deno.readFile(filename);
      ctx.res.status(206).body(buf.slice(st, ed + 1));
      return;
    }

    const file = await Deno.open(filename);
    const contentType = lookup(filename);
    if (contentType) {
      ctx.res.headers.set('Content-Type', contentType);
    }
    ctx.res.headers.set('Content-Length', String(fileinfo.size));
    ctx.res.headers.set('Accept-Ranges', 'bytes');
    ctx.res.headers.set('Content-Range', `bytes 0-${total - 1}/${total}`);
    ctx.res.status(200).body(file);
  }
}
