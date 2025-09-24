import { ExpenseTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeDao } from "../dao/ExpenseTypeDao.ts";
import { Expense, expenseSchema } from "../../schemas/expenseSchema.ts";

export class ExpenseMapper {
    private readonly expenseTypeDao: ExpenseTypeDao;

    constructor(expenseTypeDao: ExpenseTypeDao) {
        this.expenseTypeDao = expenseTypeDao;
    }

    async toExpenseDto(expenseRow: ExpenseTableRow): Promise<Expense> {
        return expenseSchema.parse({
            id: expenseRow.id,
            carId: expenseRow.car_id,
            type: await this.expenseTypeDao.getExpenseTypeById(expenseRow.type_id),
            amount: expenseRow.amount,
            currency: expenseRow.currency,
            note: expenseRow.note,
            date: expenseRow.date
        });
    }

    toExpenseTypeEntity(expense: Expense): ExpenseTableRow {
        return {
            id: expenseType.id,
            key: expenseType.key,
            owner_id: expenseType.ownerId
        };
    }
}