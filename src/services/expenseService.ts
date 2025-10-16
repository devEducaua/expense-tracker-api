import pool from "../db/pool";
import Expense from "../domain/expense";

export default class ExpenseService {

    async getAll() {
        const result = await pool.query("SELECT * FROM expenses");

        return result.rows;
    }

    async getById(userId: string) {

        const result = await pool.query("SELECT * FROM expenses WHERE user_id=$1", [userId]);

        if (result.rows.length < 1) throw new Error("no expenses found");

        return result.rows[0];
    }

    async create(expense: Expense, userId: string) {
        const { description, date, amount } = expense.deconstruct();

        await pool.query("INSERT INTO expenses (userId, amount, date, description) VALUES ($1, $2, $3, $4)", [userId, amount, date, description]);
    }

    async update(expense: Expense, expenseId: string) {
        const { description, date, amount } = expense.deconstruct();

        await pool.query("UPDATE expenses SET amount=$1, date=$2, description=$3 WHERE id=$4", [amount, date, description, expenseId]);
    }

    async delete(id: string) {
        await pool.query("DELETE FROM expenses WHERE id=$1", [id]);
    }
}
