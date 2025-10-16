import { Hono } from "hono";
import { jwt } from "hono/jwt";
import expenses from "./controllers/expenseController";
import users from "./controllers/userController";

const app = new Hono().basePath("/api");

const envkey = process.env.JWT!;

app.use("/expenses*", jwt({
    secret: envkey
}))

app.route("/", users);
app.route("/", expenses);

export default {
    fetch: app.fetch,
    port: 8080
}
