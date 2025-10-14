
export default class User {
    private name: string;
    private email: string;
    private password: string;

    constructor(name: string, email: string, password: string) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    deconstruct() {
        return {
            name: this.name,
            email: this.email,
            password: this.password
        }
    }
}
