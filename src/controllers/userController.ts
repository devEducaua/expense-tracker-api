import { Hono, Context } from "hono";
import User from "../domain/user";
import UserRepository from "../repositories/userRepository";

const repo = new UserRepository();

const users = new Hono().basePath("/users");

users.post("/login", async (c: Context) => {
    const { name, email, password } = await c.req.json();

    const userObj = new User(name, email, password);

    const jwt = await repo.login(userObj);

    c.json({ jwt: jwt });
})

users.get("/", async (c: Context) => {
    const result = await repo.getAll();

    return c.json({ data: result })
})

users.post("/", async (c: Context) => {
    const { name, email, password } = await c.req.json();

    const userObj = new User(name, email, password);

    await repo.create(userObj);

    c.json({ user: "created" });
})

users.post("/:id", async (c: Context) => {
    const id = c.req.param("id");
    const { name, email, password } = await c.req.json();

    const userObj = new User(name, email, password);

    await repo.update(userObj, id);

    c.json({ user: "updated" });
})

users.delete("/:id", async (c: Context) => {
    const id = c.req.param("id");
    await repo.delete(id);

    return c.json({ user: `${id} deleted` })
})

export default users;
