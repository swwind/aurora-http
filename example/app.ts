import KServer from "../server.ts";

const app = new KServer({ name: 'Lumine' });
const router = app.createRouter();

router.use('/', async (ctx, nxt) => {
  ctx.res.status(200).text('hello world');
});

app.use(router.routes());
app.listen(8000);
console.log('listening on http://localhost:8000');
