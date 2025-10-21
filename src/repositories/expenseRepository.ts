import { expensesTable } from "../db/schema";
import Expense from "../domain/expense";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";

const db = drizzle({ connection: process.env.DB_URL!, casing: "snake_case" });

export default class ExpenseRepository {

    async getAll() {
        const result = await db.select().from(expensesTable);

        return result;
    }

    async getById(userId: string) {

        const userIdNum = Number(userId);

        const result = await db.select()
                               .from(expensesTable)
                               .where(eq(expensesTable.userId, userIdNum));

        return result;
    }

    async create(expense: Expense, userId: string) {
        const { description, date, amount } = expense.deconstruct();

        const dbAmount = Number(amount);

        await db.insert(expensesTable)
                .values({ dbAmount, description, date, userId });
    }

    async update(expense: Expense, expenseId: string) {
        const { description, date, amount } = expense.deconstruct();

        await db.update(expensesTable)
                .set({ amount: amount, description: description, date: date })
                .where(eq(expensesTable.id, Number(expenseId)));
    }

    async delete(id: string) {
        await db.delete(expensesTable).where(eq(expensesTable.id, Number(id)));
    }
}
