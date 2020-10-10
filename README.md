# Simple Koa

This is a simple http framework like koa designed for Deno and TypeScript.

This framework is a lazy one, not conclude too many features, but maybe useful in some situations.

Everything is strong typed.

## Create Server

```ts
import { KServer, KRouter } from 'https://cdn.jsdelivr.net/gh/swwind/simple-koa/mod.ts';


type State = { name: string };
// create server
const app = new KServer<State>();
// set default state
app.state({ name: 'lumine' });
// create route
const router = new KRouter<State>();

```

If you felt terrible to write `<State>` so many times, you can write:

```ts
// create server and set default state
const app = new KServer({ name: 'lumine' });
// create router
const router = app.createRouter();
```

## Router

Notice that you must write `.status(200)` in order not to get 404 by default.

```ts
router.use('/hello', async (ctx, nxt) => {
  ctx.res.status(200).text('hello world');
});
router.use('/world', async (ctx, nxt) => {
  ctx.res.status(200).json({ text: 'hello world' });
});
router.use('/index.html', async (ctx, nxt) => {
  ctx.res.status(200).html('<h1>hello world</h1>');
});
router.use('/jump', async (ctx, nxt) => {
  ctx.res.redirect('https://blog.swwind.me');
});

router.use<{ postid: string }>('/post/:postid', async (ctx, nxt) => {
  ctx.res.status(200).json(ctx.req.param); // {"postid":"..."}
});

const subrouter = app.createRouter();
subrouter.use('/you', async (ctx, nxt) => {
  ctx.res.status(200).text('I love you too');
});
subrouter.use('/emilia', async (ctx, nxt) => {
  ctx.res.status(200).text('I love emilia too');
});
router.use('/i/love', subrouter.routes());
// "/i/love/you"    => "I love you too"
// "/i/love/emilia" => "I love emilia too"

app.use(router.routes());
```

## Listen

```ts
app.listen(4000);
app.listen(0); // random
```