import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ExpenseTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Expense } from "../../schemas/expenseSchema.ts";
import { EXPENSE_TABLE } from "../../../../database/connector/powersync/tables/expense.ts";
import { ExpenseTypeDao } from "./ExpenseTypeDao.ts";
import { ExpenseMapper, SelectExpenseTableRow } from "../mapper/expenseMapper.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { ExpenseFormFields } from "../../schemas/form/expenseForm.ts";
import { FUEL_LOG_TABLE } from "../../../../database/connector/powersync/tables/fuelLog.ts";
import { SERVICE_LOG_TABLE } from "../../../../database/connector/powersync/tables/serviceLog.ts";
import { CAR_TABLE } from "../../../../database/connector/powersync/tables/car.ts";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";
import { EXPENSE_TYPE_TABLE } from "../../../../database/connector/powersync/tables/expenseType.ts";
import { CURRENCY_TABLE } from "../../../../database/connector/powersync/tables/currency.ts";
import { WatchQueryOptions } from "../../../../database/watcher/watcher.ts";
import { UseWatchedQueryItemProps } from "../../../../database/hooks/useWatchedQueryItem.ts";
import { MODEL_TABLE } from "../../../../database/connector/powersync/tables/model.ts";
import { MAKE_TABLE } from "../../../../database/connector/powersync/tables/make.ts";
import { UseWatchedQueryCollectionProps } from "../../../../database/hooks/useWatchedQueryCollection.ts";
import { UseInfiniteQueryOptions } from "../../../../database/hooks/useInfiniteQuery.ts";

export class ExpenseDao extends Dao<ExpenseTableRow, Expense, ExpenseMapper, SelectExpenseTableRow> {
    constructor(
        db: Kysely<DatabaseType>,
        powersync: AbstractPowerSyncDatabase,
        expenseTypeDao: ExpenseTypeDao
    ) {
        super(
            db,
            powersync,
            EXPENSE_TABLE,
            new ExpenseMapper(expenseTypeDao)
        );
    }

    selectQuery(id?: any | null) {
        let query = this.db
        .selectFrom(`${ EXPENSE_TABLE } as expense` as const)
        .innerJoin(`${ CAR_TABLE } as car` as const, `car.id`, `expense.car_id`)
        .innerJoin(`${ MODEL_TABLE } as model` as const, "model.id", "car.model_id")
        .innerJoin(`${ MAKE_TABLE } as make` as const, "make.id", "model.make_id")
        .leftJoin(`${ FUEL_LOG_TABLE } as fuel` as const, `fuel.expense_id`, `expense.id`)
        .leftJoin(`${ SERVICE_LOG_TABLE } as service` as const, `service.expense_id`, `expense.id`)
        .innerJoin(`${ EXPENSE_TYPE_TABLE } as type` as const, `type.id`, `expense.type_id`)
        .innerJoin(`${ CURRENCY_TABLE } as car_curr` as const, `car_curr.id`, `car.currency_id`)
        .innerJoin(`${ CURRENCY_TABLE } as exp_curr` as const, `exp_curr.id`, `expense.currency_id`)
        .select((eb) => [
            "expense.id as id",
            "expense.original_amount",
            "expense.exchange_rate",
            "expense.amount",
            "expense.note",
            "expense.date",
            eb.fn.coalesce("fuel.id", "service.id").as("related_id"),
            "car.id as car_id",
            "car.name as car_name",
            "model.id as car_model_id",
            "model.name as car_model_name",
            "car.model_year as car_model_year",
            "make.id as car_make_id",
            "make.name as car_make_name",
            "car.currency_id as car_currency_id",
            "car_curr.key as car_currency_key",
            "car_curr.symbol as car_currency_symbol",
            "exp_curr.id as currency_id",
            "exp_curr.key as currency_key",
            "exp_curr.symbol as currency_symbol",
            "type.id as type_id",
            "type.owner_id as type_owner_id",
            "type.key as type_key"
        ]).$castTo<SelectExpenseTableRow>();

        if(id) query = query.where("expense.id", "=", id);

        return query;
    }

    expenseWatchedQueryItem(
        id: string | null | undefined,
        options?: WatchQueryOptions
    ): UseWatchedQueryItemProps<Expense, SelectExpenseTableRow> {
        return {
            query: this.selectQuery(id),
            mapper: this.mapper.toDto.bind(this.mapper),
            options: { enabled: !!id, ...options }
        };
    }

    latestExpenseWatchedQueryCollection(
        carId: string | null | undefined,
        options?: WatchQueryOptions
    ): UseWatchedQueryCollectionProps<Expense, SelectExpenseTableRow> {
        const query = this.selectQuery()
        .whereRef("expense.car_id", "=", carId as any)
        .orderBy("expense.date", "desc")
        .limit(3);

        return {
            query: query,
            mapper: this.mapper.toDtoArray.bind(this.mapper),
            options: { enabled: !!carId, ...options }
        };
    }

    expenseTimelineInfiniteQuery(carId: string): UseInfiniteQueryOptions<ReturnType<ExpenseDao["selectQuery"]>, Expense> {
        return {
            baseQuery: this.selectQuery(),
            defaultCursorOptions: {
                cursor: [
                    { field: "expense.date", order: "desc" },
                    { field: "expense.amount", order: "desc" },
                    { field: "expense.id", order: "desc" }
                ],
                defaultOrder: "desc"
            },
            defaultFilters: [
                {
                    key: CAR_TABLE,
                    filters: [{ field: "car.id", operator: "=", value: carId }],
                    logic: "AND"
                }
            ],
            mapper: this.mapper.toDto.bind(this.mapper)
        };
    }

    async createFromFormResult(formResult: ExpenseFormFields) {
        const expenseEntity = this.mapper.formResultToEntity(formResult);
        return await super.create(expenseEntity);
    }

    async updateFromFormResult(formResult: ExpenseFormFields) {
        const expenseEntity = this.mapper.formResultToEntity(formResult);
        return await super.update(expenseEntity);
    }
}