import KServer from "../server.ts";
import { parseBody } from "../parse-body.ts";

const app = new KServer();
const router = app.createRouter();

router.post('/', async (ctx, nxt) => {
  ctx.res.status(200).json(ctx.req.body);
});

app.use(parseBody());
app.use(router.routes());
app.listen(8000);

console.log("Try to post something to http://localhost:8000/");
