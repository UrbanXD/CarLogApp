import { ExpenseTypeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Odometer } from "../../../car/schemas/odometerSchema.ts";
import { ExpenseType, expenseTypeSchema } from "../../schemas/expenseTypeSchema.ts";

export class ExpenseTypeMapper {
    constructor() {}

    toExpenseTypeDto(expenseTypeRow: ExpenseTypeTableRow): Odometer {
        return expenseTypeSchema.parse({
            id: expenseTypeRow.id,
            key: expenseTypeRow.key,
            ownerId: expenseTypeRow.owner_id
        });
    }

    toExpenseTypeEntity(expenseType: ExpenseType): ExpenseTypeTableRow {
        return {
            id: expenseType.id,
            key: expenseType.key,
            owner_id: expenseType.ownerId
        };
    }
}