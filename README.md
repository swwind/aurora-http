# Aurora

This is a simple http framework like koa designed for Deno and TypeScript.

This framework is for lazy guys, hope you like it.

Everything is strong typed.

## Create Server

In order to avoid a lot of same-naming class(e.g. `Server`) in your project, we added prefix `K` for every class in this project.

```ts
import { KServer, KRouter } from 'https://cdn.jsdelivr.net/gh/swwind/aurora/mod.ts';


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

Notice that you must write `.status(200)` in order not to get 500 by default.

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
  ctx.res.fail('I don\'t love you');
});
subrouter.use('/emilia', async (ctx, nxt) => {
  ctx.res.status(200).text('I love emilia!!');
});
router.use('/love', subrouter.routes());
// "/love/you"    => 403 "I don't love you"
// "/love/emilia" => 200 "I love emilia too"

app.use(router.routes());
```

## Listen

```ts
app.listen(4000);
app.listen(0); // random port
```

## Cookie

```ts
router.use('/cookie', async (ctx, nxt) => {
  ctx.res.status(200).json(ctx.cookie.cookie);
});
router.use('/setcookie', async (ctx, nxt) => {
  ctx.cookie.set({ name: 'gawr', value: 'gura' });
  ctx.res.redirect('/cookie');
});
router.use('/deletecookie', async (ctx, nxt) => {
  ctx.cookie.remove('gawr');
  ctx.res.redirect('/cookie');
});
```

See `example/cookie.ts`

## Vhost

Only matches with the same host.

```ts
// two different sites
app.use(vhost('localhost:8000'), router1.routes());
app.use(vhost('127.0.0.1:8000'), router2.routes());
```

See `example/vhost.ts`

## Serve

Serve static files.

206 supported.

```ts
app.use(serve('./public'));
```

See `example/serve.ts`

## Post

JSON and URL encoded format body only.

Otherwise `ctx.req.body` will be `{}`.

```ts
app.use(parseBody());
app.use((ctx, nxt) => {
  ctx.res.status(200).json(ctx.req.body);
});
```

## URL Search Params

```ts
app.use((ctx, nxt) => {
  const foo = ctx.req.query.get('foo');
  if (foo == null) {
    ctx.res.fail("You must provide `foo' param");
    return;
  }
  ctx.res.status(200).text(foo);
});
// GET /?foo=bar  =>  200 "bar"
// GET /?bar=foo  =>  403 "You must provide `foo' param"
```
