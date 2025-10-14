import pool from "../db/pool";
import User from "../domain/user";
import * as jose from "jose";

export default class UserService {

    async login(user: User) {
        const { name, email, password } = user.deconstruct();

        const queryResult = await pool.query("SELECT id, password FROM users WHERE name=$1 AND email=$2", [name, email]);

        const dbPassword = queryResult.rows[0].password;

        const isValid: boolean = await Bun.password.verify(password, dbPassword);

        if (!isValid) throw new Error("invalid credentials on login");

        const secret = new TextEncoder().encode(process.env.JWT);

        const token = await new jose.SignJWT({ userId: queryResult.rows[0].id, name, email })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('2h')
            .sign(secret);

        return token;
    }

    async getAll() {
        const result = await pool.query("SELECT * FROM users", []);
        return result.rows;
    }
    
    async create(user: User) {
        const { name, email, password } = user.deconstruct();

        const hash = Bun.password.hash(password, { algorithm: "bcrypt" });

        await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, hash]);
    }

    
    async update(user: User, id: string) {
        const { name, email, password } = user.deconstruct();
        const hash = Bun.password.hash(password, { algorithm: "bcrypt" });

        await pool.query("UPDATE users SET name=$1, email=$2, password=$3 WHERE id=$4", [name, email, hash, id]);
    }

    
    async delete(id: string) {
        await pool.query("DELETE FROM users WHERE id=$1", [id]);
    }
}
