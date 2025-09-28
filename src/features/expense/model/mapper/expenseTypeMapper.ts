import { ExpenseTypeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseType, expenseTypeSchema } from "../../schemas/expenseTypeSchema.ts";

export class ExpenseTypeMapper {
    constructor() {}

    toExpenseTypeDto(expenseTypeRow: ExpenseTypeTableRow): ExpenseType {
        return expenseTypeSchema.parse({
            id: expenseTypeRow.id,
            key: expenseTypeRow.key,
            ownerId: expenseTypeRow.owner_id
        });
    }

    toExpenseTypeArrayDto(expenseTypeRows: Array<ExpenseTypeTableRow>): Array<ExpenseType> {
        return expenseTypeRows.map(this.toExpenseTypeDto);
    }

    toExpenseTypeEntity(expenseType: ExpenseType): ExpenseTypeTableRow {
        return {
            id: expenseType.id,
            key: expenseType.key,
            owner_id: expenseType.ownerId
        };
    }
}