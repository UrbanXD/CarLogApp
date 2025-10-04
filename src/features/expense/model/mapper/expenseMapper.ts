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
            id: entity.id,
            carId: entity.car_id,
            type: await this.expenseTypeDao.getById(entity.type_id),
            amount: entity.amount,
            currency: entity.currency,
            note: entity.note,
            date: entity.date
        });
    }

    async toEntity(dto: Expense): Promise<ExpenseTableRow> {
        return {
            id: dto.id,
            key: dto.key,
            owner_id: dto.ownerId
        };
    }
}