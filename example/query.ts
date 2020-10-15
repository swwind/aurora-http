import KServer from "../server.ts";

const app = new KServer();
const router = app.createRouter();

router.use('/', async (ctx, nxt) => {
  const av = ctx.req.query.get('av');
  if (av == null) {
    ctx.res.fail("You must provide `av' param");
    return;
  }
  ctx.res.status(200).text(av);
});

app.use(router.routes());
app.listen(8000);

console.log("Visit http://localhost:8000/?av=170001");
