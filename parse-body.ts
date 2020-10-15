import { KMiddleware } from "./middleware.ts";

const decoder = new TextDecoder();

/**
 * Support JSON and URL encoded format only.
 */
export const parseBody = <R, S> (): KMiddleware<R, S> => async (ctx, nxt) => {
  try {
    const data = await Deno.readAll(ctx.req._serverRequest.body);
    const contentType = ctx.req.headers.get("Content-Type");
    
    if (contentType === "application/json") {
      ctx.req.body = JSON.parse(decoder.decode(data));
    }
    if (contentType === "application/x-www-form-urlencoded") {
      const params = new URLSearchParams(decoder.decode(data));
      const body = { } as any;
      for (const [key, value] of params) {
        body[key] = value;
      }
      ctx.req.body = body;
    }

  } catch (e) {
    ctx.req.body = { };
  }

  await nxt();
}
