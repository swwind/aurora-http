import KServer from "../server.ts";

const app = new KServer({ name: "Lumine" });
const router = app.createRouter();

router.use("/cookie", async (ctx, nxt) => {
  ctx.res.status(200).json(ctx.cookie.cookie);
});
router.use("/setcookie", async (ctx, nxt) => {
  ctx.cookie.set({ name: "a", value: "2333" });
  ctx.cookie.set({ name: "b", value: "6000" });
  ctx.res.redirect("/cookie");
});
router.use("/deletecookie", async (ctx, nxt) => {
  ctx.cookie.remove("a");
  ctx.res.redirect("/cookie");
});

app.use(router.routes());
app.listen(8000);

console.log("check your cookie: http://localhost:8000/cookie");
console.log("Add 'a' and 'b' cookie: http://localhost:8000/setcookie");
console.log("Remove 'a' cookie: http://localhost:8000/deletecookie");
