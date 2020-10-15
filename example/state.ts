import KServer from "../server.ts";

let req = 0;
const app = new KServer(() => {
  return {
    req: ++ req,
  }
});

app.use(async (ctx) => {
  ctx.res.status(200).text(`This is your ${ctx.state.req}-th request`);
});
app.listen(8000);

console.log("f5 on http://localhost:8000/");
