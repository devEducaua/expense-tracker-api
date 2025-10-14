import { Hono } from 'hono'
import { jwt } from "hono/jwt";

const app = new Hono().basePath("/api");

const envkey = process.env.JWT!;

app.use("/expenses*", jwt({
    secret: envkey
}))

export default app;
