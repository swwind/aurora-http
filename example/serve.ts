import KServer from "../server.ts";
import { serve } from "../serve.ts";

const app = new KServer();

app.use(serve('./example/testfolder'));
app.listen(8000);

console.log("HTTP 200 on http://localhost:8000/");
console.log("HTTP 200 on http://localhost:8000/pic.jpg");
