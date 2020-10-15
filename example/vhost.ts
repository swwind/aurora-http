import KServer from "../server.ts";
import { vhost } from "../vhost.ts";

const app = new KServer();
const router1 = app.createRouter();
const router2 = app.createRouter();

router1.use("/", async (ctx, nxt) => {
  ctx.res.status(200).text("Kirara");
});
router2.use("/", async (ctx, nxt) => {
  ctx.res.status(200).text("Magic!");
});

app.use(vhost('localhost:8000', router1.routes()));
app.use(vhost('127.0.0.1:8000', router2.routes()));
app.listen(8000);

console.log("Kirara -> http://localhost:8000/");
console.log("Magic! -> http://127.0.0.1:8000/");
