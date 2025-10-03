import { ExpenseTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeDao } from "../dao/ExpenseTypeDao.ts";
import { Expense, expenseSchema } from "../../schemas/expenseSchema.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";

export class ExpenseMapper extends AbstractMapper<ExpenseTableRow, Expense> {
    private readonly expenseTypeDao: ExpenseTypeDao;

    constructor(expenseTypeDao: ExpenseTypeDao) {
        super();
        this.expenseTypeDao = expenseTypeDao;
    }

    async toDto(entity: ExpenseTableRow): Promise<Expense> {
        return expenseSchema.parse({
            id: expenseRow.id,
            carId: expenseRow.car_id,
            type: await this.expenseTypeDao.getById(expenseRow.type_id),
            amount: expenseRow.amount,
            currency: expenseRow.currency,
            note: expenseRow.note,
            date: expenseRow.date
        });
    }

    async toEntity(dto: Expense): Promise<ExpenseTableRow> {
        return {
            id: expenseType.id,
            key: expenseType.key,
            owner_id: expenseType.ownerId
        };
    }

    async toExpenseDto(expenseRow: ExpenseTableRow): Promise<Expense> {
        return expenseSchema.parse({
            id: expenseRow.id,
            carId: expenseRow.car_id,
            type: await this.expenseTypeDao.getById(expenseRow.type_id),
            amount: expenseRow.amount,
            currency: expenseRow.currency,
            note: expenseRow.note,
            date: expenseRow.date
        });
    }

}