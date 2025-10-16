import { Hono, Context } from "hono";
import Expense from "../domain/expense";
import ExpenseService from "../services/expenseService";

const expenses = new Hono().basePath("expenses");
const service = new ExpenseService();

expenses.get("/", async (c: Context) => {
    const result = await service.getAll();

    return c.json({ data: result });
})

expenses.get("/:id", async (c: Context) => {
    const id = c.req.param("id");

    const result = await service.getById(id);

    return c.json({ expense: result });
})

expenses.post("/", async (c: Context) => {
    const payload = c.get('jwtPayload');
    const userId = payload.userId;

    const { amount, description, date } = await c.req.json();

    const expenseObj = new Expense(amount, description, date);

    await service.create(expenseObj, userId);

    c.status(201);
    return c.json({ user: "created" });
})

expenses.put("/:id", async (c: Context) => {
    const expenseId = c.req.param("id");

    const { amount, description, date } = await c.req.json();

    const expenseObj = new Expense(amount, description, date);

    await service.update(expenseObj, expenseId);

    return c.json({ user: "updated" });
})

expenses.delete("/:id", async (c: Context) => {
    const expenseId = c.req.param("id");

    await service.delete(expenseId);

    c.status(204);
    return c.json({ user: "deleted" });
})

export default expenses;
