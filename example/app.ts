import KServer from "../server.ts";

const app = new KServer({ name: "Lumine" });
const router = app.createRouter();

router.use("/cookie", async (ctx, nxt) => {
  ctx.res.status(200).json(ctx.cookie.cookie);
});
router.use("/setcookie", async (ctx, nxt) => {
  ctx.cookie.set({ name: "a", value: "2333" });
  ctx.res.redirect("/cookie");
});
router.use("/deletecookie", async (ctx, nxt) => {
  ctx.cookie.remove("a");
  ctx.res.redirect("/cookie");
});

app.use(router.routes());
app.listen(8000);
console.log("listening on http://localhost:8000");
