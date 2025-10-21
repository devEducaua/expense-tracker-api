import User from "../domain/user";
import * as jose from "jose";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { usersTable } from "../db/schema";

const db = drizzle({ connection: process.env.DB_URL!, casing: "snake_case" });

export default class UserRepository {

    async login(user: User) {
        const { name, email, password } = user.deconstruct();

        const queryResult = await db.select({ dbPassword: usersTable.password }).from(usersTable);
        const { dbPassword } = queryResult[0];

        const isValid: boolean = await Bun.password.verify(password, dbPassword);

        if (!isValid) throw new Error("invalid credentials on login");

        const secret = new TextEncoder().encode(process.env.JWT);

        const token = await new jose.SignJWT({ userId: queryResult.rows[0].id, name, email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("2h")
            .sign(secret);

        return token;
    }

    async getAll() {
        const result = await db.select().from(usersTable);
        return result;
    }
    
    async create(user: User) {
        const { name, email, password } = user.deconstruct();

        const hash: string = await Bun.password.hash(password, { algorithm: "bcrypt" });

        await db.insert(usersTable)
                .values({ name: name, email: email, password: hash });
    }

    async update(user: User, id: string) {
        const { name, email, password } = user.deconstruct();
        const hash = await Bun.password.hash(password, { algorithm: "bcrypt" });

        await db.update(usersTable)
                .set({ name: name, email: email, password: hash })
                .where(eq(usersTable.id, Number(id)));
    }

    async delete(id: string) {
        await db.delete(usersTable).where(eq(usersTable.id, Number(id)));
    }
}
