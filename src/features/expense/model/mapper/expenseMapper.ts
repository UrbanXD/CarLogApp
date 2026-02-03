import {
    CurrencyTableRow,
    ExpenseTableRow,
    ExpenseTypeTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { ExpenseTypeDao } from "../dao/ExpenseTypeDao.ts";
import { Expense, expenseSchema } from "../../schemas/expenseSchema.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { ExpenseFormFields } from "../../schemas/form/expenseForm.ts";
import { currencySchema } from "../../../_shared/currency/schemas/currencySchema.ts";
import { numberToFractionDigit } from "../../../../utils/numberToFractionDigit.ts";
import { amountSchema } from "../../../_shared/currency/schemas/amountSchema.ts";
import { WithPrefix } from "../../../../types";
import { SelectCarModelTableRow } from "../../../car/model/dao/CarDao.ts";
import { carSimpleSchema } from "../../../car/schemas/carSchema.ts";
import { BarChartStatistics, DonutChartStatistics, Stat } from "../../../../database/dao/types/statistis.ts";
import {
    ExpenseRecordTableRow,
    ExpenseTypeComparisonTableRow,
    GroupedExpensesByRangeTableRow
} from "../dao/ExpenseDao.ts";
import { LegendType } from "../../../statistics/components/charts/common/Legend.tsx";
import { BarChartItem } from "../../../statistics/components/charts/BarChartView.tsx";

export type SelectAmountCurrencyTableRow =
    WithPrefix<CurrencyTableRow, "currency">
    & WithPrefix<CurrencyTableRow, "car_currency">;

export type SelectExpenseTableRow =
    ExpenseTableRow
    & Omit<SelectAmountCurrencyTableRow, "currency_id">
    & WithPrefix<ExpenseTypeTableRow, "type">
    & WithPrefix<Omit<SelectCarModelTableRow, "id">, "car">
    & { related_id: string | null }

export class ExpenseMapper extends AbstractMapper<ExpenseTableRow, Expense, SelectExpenseTableRow> {
    private readonly expenseTypeDao: ExpenseTypeDao;

    constructor(expenseTypeDao: ExpenseTypeDao) {
        super();
        this.expenseTypeDao = expenseTypeDao;
    }

    toDto(entity: SelectExpenseTableRow): Expense {
        const car = carSimpleSchema.parse({
            id: entity.car_id,
            name: entity.car_name,
            model: {
                id: entity.car_model_id,
                name: entity.car_model_name,
                year: entity.car_model_year,
                make: {
                    id: entity.car_make_id,
                    name: entity.car_make_name
                }
            },
            currency: {
                id: entity.car_currency_id,
                key: entity.car_currency_key,
                symbol: entity.car_currency_symbol
            }
        });

        const type = this.expenseTypeDao.mapper.toDto({
            id: entity.type_id,
            owner_id: entity.type_owner_id,
            key: entity.type_key
        });

        const amount = amountSchema.parse({
            amount: numberToFractionDigit(entity.original_amount ?? 0),
            exchangedAmount: numberToFractionDigit((entity.original_amount ?? 0) * (entity.exchange_rate ?? 0)),
            exchangeRate: numberToFractionDigit(entity.exchange_rate ?? 0),
            currency: currencySchema.parse({
                id: entity.currency_id,
                key: entity.currency_key,
                symbol: entity.currency_symbol
            }),
            exchangeCurrency: currencySchema.parse({
                id: entity.car_currency_id,
                key: entity.car_currency_key,
                symbol: entity.car_currency_symbol
            })
        });

        return expenseSchema.parse({
            id: entity.id,
            car: car,
            relatedId: entity?.related_id ?? null,
            type: type,
            amount: amount,
            note: entity.note,
            date: entity.date
        });
    }

    toEntity(dto: Expense): ExpenseTableRow {
        return {
            id: dto.id,
            car_id: dto.car.id,
            type_id: dto.type.id,
            currency_id: dto.amount.exchangeCurrency.id,
            amount: dto.amount.exchangedAmount,
            original_amount: dto.amount.amount,
            exchange_rate: dto.amount.exchangeRate,
            note: dto.note,
            date: dto.date
        };
    }

    toStat(entity: ExpenseRecordTableRow): Stat {
        const type = this.expenseTypeDao.mapper.toDto({
            id: entity.type_id,
            owner_id: entity.owner_id,
            key: entity.key
        });

        return {
            value: numberToFractionDigit(entity.amount ?? 0),
            label: type.key,
            color: type.primaryColor
        };
    }

    typeComparisonToDonutChartStatistics(entities: Array<ExpenseTypeComparisonTableRow>): DonutChartStatistics {
        const legend: LegendType = {};

        return {
            chartData: entities.map((entity, index) => {
                if(!legend?.[entity.type_id]) {
                    const type = this.expenseTypeDao.mapper.toDto({
                        id: entity.type_id,
                        owner_id: entity.owner_id,
                        key: entity.key
                    });

                    legend[type.id] = { label: type.key, color: type.primaryColor };
                }

                return {
                    value: numberToFractionDigit(entity.percent ?? 0),
                    label: legend[entity.type_id].label,
                    description: numberToFractionDigit(entity.total ?? 0).toString(),
                    color: legend[entity.type_id].color,
                    focused: index === 0
                };
            }),
            legend
        };
    }

    async groupedExpensesByRangeToBarChartStatistics(
        entities: Array<GroupedExpensesByRangeTableRow>,
        type?: string
    ): Promise<BarChartStatistics> {
        const expenseTypes = !type ? await this.expenseTypeDao.getAll() : [await this.expenseTypeDao.getByKey(type)];
        const typeIds = expenseTypes.map((t) => t.id);

        const chartData: Array<BarChartItem> = [];

        if(expenseTypes.length === 1) {
            const singleType = expenseTypes[0];
            entities.forEach((entity) => {
                chartData.push({
                    label: entity.time,
                    type: singleType.id,
                    value: numberToFractionDigit(Number(entity.total) ?? 0)
                });
            });
        } else {
            const groupedData: { [time: string]: { [typeId: string]: number } } = {};

            entities.forEach((entity) => {
                const { time, type_id, total } = entity;
                if(!groupedData[time]) groupedData[time] = {};
                if(type_id) {
                    groupedData[time][type_id] = Number(total);
                }
            });

            for(const time in groupedData) {
                if(Object.prototype.hasOwnProperty.call(groupedData, time)) {
                    const valueArray = typeIds.map(typeId =>
                        numberToFractionDigit(groupedData[time][typeId] ?? 0)
                    );

                    chartData.push({
                        label: time,
                        value: valueArray,
                        type: typeIds
                    });
                }
            }
        }

        const legend: LegendType = {};
        expenseTypes.forEach((t) => {
            legend[t.id] = {
                label: t.key,
                color: t.primaryColor
            };
        });

        return {
            chartData: chartData.sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime()),
            legend
        };
    }

    formResultToEntity(formResult: ExpenseFormFields): ExpenseTableRow {
        return {
            id: formResult.id,
            car_id: formResult.carId,
            type_id: formResult.typeId,
            currency_id: formResult.expense.currencyId,
            amount: numberToFractionDigit(formResult.expense.amount * formResult.expense.exchangeRate),
            original_amount: formResult.expense.amount,
            exchange_rate: formResult.expense.exchangeRate,
            note: formResult.note,
            date: formResult.date
        };
    }
}