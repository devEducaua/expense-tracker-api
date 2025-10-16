import { Hono, Context } from "hono";
import UserService from "../services/userService";
import User from "../domain/user";
import expenses from "./expenseController";

const service = new UserService();

const users = new Hono().basePath("/users");

users.post("/login", async (c: Context) => {
    const { name, email, password } = await c.req.json();

    const userObj = new User(name, email, password);

    const jwt = await service.login(userObj);

    c.json({ jwt: jwt });
})

users.get("/", async (c: Context) => {
    const result = await service.getAll();

    return c.json({ data: result })
})

users.post("/", async (c: Context) => {
    const { name, email, password } = await c.req.json();

    const userObj = new User(name, email, password);

    await service.create(userObj);

    c.json({ user: "created" });
})

users.post("/:id", async (c: Context) => {
    const id = c.req.param("id");
    const { name, email, password } = await c.req.json();

    const userObj = new User(name, email, password);

    await service.update(userObj, id);

    c.json({ user: "updated" });
})

users.delete("/:id", async (c: Context) => {
    const id = c.req.param("id");
    await service.delete(id);

    return c.json({ user: `${id} deleted` })
})

export default users;
