import { dateOpts } from "./dateopts";

export default class Expense {
    private description: string
    private amount: number;
    private date: dateOpts;

    constructor(description: string, amount: number, date: dateOpts) {
        this.amount = amount;
        this.description = description;
        this.date = date;
    }

    deconstruct() {
        return {
            description: this.description,
            amount: this.amount,
            date: this.date
        }
    }
}
