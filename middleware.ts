import KContext from "./context.ts";

export type KNext = () => Promise<void>;

export type KMiddleware<Routes, State> =
  ( ctx: KContext<Routes, State>, next: KNext ) => Promise<void>;
