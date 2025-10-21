import { drizzle } from "drizzle-orm/node-postgres"

const db = drizzle({ connection: process.env.DB_URL!, casing: "snake_case" });
