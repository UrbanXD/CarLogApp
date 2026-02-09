import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { ServiceItemTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceItem, serviceItemSchema } from "../../schemas/serviceItemSchema.ts";
import { ServiceItemTypeDao } from "../dao/ServiceItemTypeDao.ts";
import { numberToFractionDigit } from "../../../../../../utils/numberToFractionDigit.ts";
import { CurrencyDao } from "../../../../../_shared/currency/model/dao/CurrencyDao.ts";
import { Currency } from "../../../../../_shared/currency/schemas/currencySchema.ts";
import { ServiceItemType } from "../../schemas/serviceItemTypeSchema.ts";
import { Amount, amountSchema } from "../../../../../_shared/currency/schemas/amountSchema.ts";
import {
    ServiceItemFormFields,
    ServiceItemFormTransformedFields,
    transformedServiceItemForm
} from "../../schemas/form/serviceItemForm.ts";
import { SelectServiceItemTableRow } from "../dao/ServiceItemDao.ts";
import { SelectExpenseTableRow } from "../../../../model/mapper/expenseMapper.ts";
import { WithPrefix } from "../../../../../../types";
import { SelectCarModelTableRow } from "../../../../../car/model/dao/CarDao.ts";
import { MAX_EXCHANGE_RATE_DECIMAL } from "../../../../../../constants";

export type ServiceItemTotalAmountTableRow =
    Omit<SelectExpenseTableRow, "related_id" | "car_id" | "id" | "date" | "note" | "type_id" | "type_key" | "type_owner_id" | keyof WithPrefix<Omit<SelectCarModelTableRow, "id">, "car">>

export class ServiceItemMapper extends AbstractMapper<ServiceItemTableRow, ServiceItem, SelectServiceItemTableRow> {
    private readonly serviceItemTypeDao: ServiceItemTypeDao;
    private readonly currencyDao: CurrencyDao;

    constructor(serviceItemTypeDao: ServiceItemTypeDao, currencyDao: CurrencyDao) {
        super();
        this.serviceItemTypeDao = serviceItemTypeDao;
        this.currencyDao = currencyDao;
    }

    toDto(entity: SelectServiceItemTableRow): ServiceItem {
        return serviceItemSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            serviceLogId: entity.service_log_id,
            type: this.serviceItemTypeDao.mapper.toDto({
                id: entity.service_item_type_id!,
                key: entity.type_key,
                owner_id: entity.type_owner_id
            }),
            quantity: entity.quantity,
            pricePerUnit: amountSchema.parse({
                amount: numberToFractionDigit(entity.price_per_unit ?? 0),
                exchangedAmount: numberToFractionDigit(entity.exchanged_price_per_unit ?? 0),
                exchangeRate: numberToFractionDigit(entity.exchange_rate ?? 1, MAX_EXCHANGE_RATE_DECIMAL),
                currency: {
                    id: entity.currency_id,
                    key: entity.currency_key,
                    symbol: entity.currency_symbol
                },
                exchangeCurrency: {
                    id: entity.car_currency_id,
                    key: entity.car_currency_key,
                    symbol: entity.car_currency_symbol
                }
            })
        });
    }

    toEntity(dto: ServiceItem): ServiceItemTableRow {
        return {
            id: dto.id,
            car_id: dto.carId,
            service_log_id: dto.serviceLogId,
            service_item_type_id: dto.type.id,
            currency_id: dto.pricePerUnit.currency.id,
            exchange_rate: numberToFractionDigit(dto.pricePerUnit.exchangeRate, MAX_EXCHANGE_RATE_DECIMAL),
            quantity: numberToFractionDigit(dto.quantity),
            price_per_unit: numberToFractionDigit(dto.pricePerUnit.amount)
        };
    }

    toTotalAmountArray(
        entities: Array<ServiceItemTotalAmountTableRow>
    ): Array<Amount> {
        const result = [];

        for(const entity of entities) {
            result.push(
                amountSchema.parse({
                    amount: numberToFractionDigit(entity.amount ?? 0),
                    exchangedAmount: numberToFractionDigit(entity.exchanged_amount ?? 0),
                    exchangeRate: numberToFractionDigit(entity.exchange_rate ?? 1, MAX_EXCHANGE_RATE_DECIMAL),
                    currency: {
                        id: entity.currency_id,
                        key: entity.currency_key,
                        symbol: entity.currency_symbol
                    },
                    exchangeCurrency: {
                        id: entity.car_currency_id,
                        key: entity.car_currency_key,
                        symbol: entity.car_currency_symbol
                    }
                })
            );
        }

        return result;
    }

    async toFormTransformedFields(
        formResult: ServiceItemFormFields,
        carCurrencyId: number
    ): Promise<ServiceItemFormTransformedFields> {
        const [type, carCurrency, currency]: [ServiceItemType | null, Currency | null, Currency | null] = await Promise.all(
            [
                this.serviceItemTypeDao.getById(formResult.typeId),
                this.currencyDao.getById(carCurrencyId),
                this.currencyDao.getById(formResult.expense.currencyId)
            ]
        );

        return transformedServiceItemForm.parse({
            id: formResult.id,
            type: type,
            quantity: numberToFractionDigit(formResult.expense.quantity),
            pricePerUnit: {
                amount: numberToFractionDigit(formResult.expense.amount),
                exchangedAmount: numberToFractionDigit(formResult.expense.exchangeRate * formResult.expense.amount),
                exchangeRate: numberToFractionDigit(formResult.expense.exchangeRate, MAX_EXCHANGE_RATE_DECIMAL),
                currency: currency,
                exchangeCurrency: carCurrency
            }
        });
    }
}