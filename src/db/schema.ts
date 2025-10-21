import { pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
   id: serial().primaryKey(),
    name: varchar().notNull(),
    email: varchar().notNull().unique(),
    password: varchar().notNull(),
})

export const expensesTable = pgTable("expenses", {
    id: serial().primaryKey(),
    amount: integer().notNull(),
    description: varchar().notNull(),
    date: varchar().notNull(),
    userId: integer("user_id").references(() => usersTable.id).notNull()
})
