import { KMiddleware } from "./middleware.ts";
import KRequest from "./request.ts";

type UrlPattern = {
  type: "any" | "null";
} | {
  type: "match" | "path";
  name: string;
};

type MethodPattern = "any" | "POST" | "GET" | "PUT" | "DELETE" | "OPTIONS";

type RequestPattern = {
  method: MethodPattern;
  path: UrlPattern[];
};

function parseRequestPattern(
  method: MethodPattern,
  path: string,
): RequestPattern {
  function parse(path: string): UrlPattern {
    if (path === "*") {
      return { type: "any" };
    }
    if (path.startsWith(":")) {
      return {
        type: "match",
        name: path.slice(1),
      };
    }
    if (path === "") {
      return {
        type: "null",
      };
    } else {
      return {
        type: "path",
        name: path,
      };
    }
  }

  if (path.startsWith("/")) {
    path = path.slice(1);
  }

  return {
    method,
    path: path.split("/").map(parse),
  };
}

function matchPattern(pattern: RequestPattern, req: KRequest) {
  if (pattern.method !== "any" && pattern.method !== req.method) {
    return false;
  }

  const paths = req.pathname.slice(1).split("/");
  if (paths.length < pattern.path.length) {
    return false;
  }

  const matched = match(paths, pattern.path);
  if (matched === false) {
    return false;
  }
  req.pathname = "/" + paths.slice(matched).join("/");
  return true;

  function match(paths: string[], patterns: UrlPattern[]) {
    // console.log('matching', paths, patterns);
    for (let i = 0; i < patterns.length; ++i) {
      const ptn = patterns[i];
      const pth = paths[i];
      if (ptn.type === "path") {
        if (pth !== ptn.name) {
          return false;
        }
        continue;
      }
    }
    for (let i = 0; i < patterns.length; ++i) {
      const ptn = patterns[i];
      const pth = paths[i];
      if (ptn.type === "match") {
        (req.param as any)[ptn.name] = pth;
        continue;
      }
    }

    if (patterns[patterns.length - 1].type === "null") {
      return patterns.length - 1;
    }
    return patterns.length;
  }
}

type RouteRule<Routes, State> = {
  rule: RequestPattern;
  mw: KMiddleware<Routes, State>;
};

class KRouter<State> {
  private _routeMap: RouteRule<any, State>[] = [];

  private _use(
    method: MethodPattern,
    path: string,
    mw: KMiddleware<any, State>,
  ) {
    this._routeMap.push({
      rule: parseRequestPattern(method, path),
      mw,
    });
    return this;
  }

  /**
   * Register pattern with any method
   * @param path pattern
   * @param mw middleware
   */
  use<Routes = {}>(path: string, mw: KMiddleware<Routes, State>) {
    return this._use("any", path, mw);
  }
  /**
   * Register pattern with GET method
   * @param path pattern
   * @param mw middleware
   */
  get<Routes = {}>(path: string, mw: KMiddleware<Routes, State>) {
    return this._use("GET", path, mw);
  }
  /**
   * Register pattern with PUT method
   * @param path pattern
   * @param mw middleware
   */
  put<Routes = {}>(path: string, mw: KMiddleware<Routes, State>) {
    return this._use("PUT", path, mw);
  }
  /**
   * Register pattern with POST method
   * @param path pattern
   * @param mw middleware
   */
  post<Routes = {}>(path: string, mw: KMiddleware<Routes, State>) {
    return this._use("POST", path, mw);
  }
  /**
   * Register pattern with DELETE method
   * @param path pattern
   * @param mw middleware
   */
  delete<Routes = {}>(path: string, mw: KMiddleware<Routes, State>) {
    return this._use("DELETE", path, mw);
  }
  /**
   * Register pattern with OPTIONS method
   * @param path pattern
   * @param mw middleware
   */
  options<Routes = {}>(path: string, mw: KMiddleware<Routes, State>) {
    return this._use("OPTIONS", path, mw);
  }

  /**
   * Get routes middleware
   */
  routes(): KMiddleware<{}, State> {
    const routeMap = this._routeMap;
    return async (ctx, next) => {
      let n = 0, oldpathname = ctx.req.pathname;
      async function nxt() {
        if (n === routeMap.length) {
          await next();
          return;
        }
        if (n > routeMap.length) {
          throw new Error("next() called too many times");
        }
        const route = routeMap[n++];
        ctx.req.pathname = oldpathname;
        if (matchPattern(route.rule, ctx.req)) {
          await route.mw(ctx, nxt);
        } else {
          await nxt();
        }
      }
      await nxt();
    };
  }
}

export default KRouter;
