import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { CarTableRow, ServiceItemTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FormResultServiceItem, ServiceItem, serviceItemSchema } from "../../schemas/serviceItemSchema.ts";
import { ServiceItemTypeDao } from "../dao/ServiceItemTypeDao.ts";
import { numberToFractionDigit } from "../../../../../../utils/numberToFractionDigit.ts";
import { CurrencyDao } from "../../../../../_shared/currency/model/dao/CurrencyDao.ts";
import { Currency } from "../../../../../_shared/currency/schemas/currencySchema.ts";
import { ServiceItemType } from "../../schemas/serviceItemTypeSchema.ts";
import { Amount, amountSchema } from "../../../../../_shared/currency/schemas/amountSchema.ts";
import { ServiceItemFields } from "../../schemas/form/serviceItemForm.ts";

export type SelectServiceItemTableRow = ServiceItemTableRow & { car_currency_id: number }

export type ServiceItemTotalAmountTableRow =
    Pick<ServiceItemTableRow, "service_log_id" | "currency_id" | "exchange_rate">
    &
    {
        car_currency_id: CarTableRow["currency_id"],
        total_amount: number,
        exchanged_total_amount: number
    }

export class ServiceItemMapper extends AbstractMapper<ServiceItemTableRow, ServiceItem, SelectServiceItemTableRow> {
    private readonly serviceItemTypeDao: ServiceItemTypeDao;
    private readonly currencyDao: CurrencyDao;

    constructor(serviceItemTypeDao: ServiceItemTypeDao, currencyDao: CurrencyDao) {
        super();
        this.serviceItemTypeDao = serviceItemTypeDao;
        this.currencyDao = currencyDao;
    }

    async toDto(entity: SelectServiceItemTableRow): Promise<ServiceItem> {
        const [type, carCurrency, currency]: [ServiceItemType | null, Currency | null, Currency | null] = await Promise.all(
            [
                this.serviceItemTypeDao.getById(entity.service_item_type_id),
                this.currencyDao.getById(entity.car_currency_id),
                this.currencyDao.getById(entity.currency_id)
            ]
        );

        return serviceItemSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            serviceLogId: entity.service_log_id,
            type: type,
            quantity: entity.quantity,
            pricePerUnit: amountSchema.parse({
                amount: numberToFractionDigit(entity.price_per_unit),
                exchangedAmount: numberToFractionDigit(entity.exchange_rate * entity.price_per_unit),
                exchangeRate: numberToFractionDigit(entity.exchange_rate),
                currency: currency,
                exchangeCurrency: carCurrency
            })
        });
    }

    async toEntity(dto: ServiceItem): Promise<ServiceItemTableRow> {
        return {
            id: dto.id,
            car_id: dto.carId,
            service_log_id: dto.serviceLogId,
            service_item_type_id: dto.type.id,
            currency_id: dto.pricePerUnit.currency.id,
            exchange_rate: dto.pricePerUnit.exchangeRate,
            quantity: dto.quantity,
            price_per_unit: dto.pricePerUnit
        };
    }

    async toTotalAmountArray(carCurrencyId: number, entities: Array<ServiceItemTotalAmountTableRow>): Array<Amount> {
        const carCurrency = await this.currencyDao.getById(carCurrencyId);
        const result = [];

        for(const entity of entities) {
            const currency = await this.currencyDao.getById(entity.currency_id);

            result.push(
                amountSchema.parse({
                    amount: numberToFractionDigit(entity.total_amount),
                    exchangedAmount: numberToFractionDigit(entity.exchanged_total_amount),
                    exchangeRate: numberToFractionDigit(entity.exchange_rate),
                    currency: currency,
                    exchangeCurrency: carCurrency
                })
            );
        }

        return result;
    }

    async formResultToDto(formResult: ServiceItemFields & { carCurrencyId: number }): Promise<FormResultServiceItem> {
        const [type, carCurrency, currency]: [ServiceItemType | null, Currency | null, Currency | null] = await Promise.all(
            [
                this.serviceItemTypeDao.getById(formResult.typeId),
                this.currencyDao.getById(formResult.carCurrencyId),
                this.currencyDao.getById(formResult.expense.currencyId)
            ]
        );

        return serviceItemSchema.omit({ serviceLogId: true, carId: true }).parse({
            id: formResult.id,
            type: type,
            quantity: formResult.expense.quantity,
            pricePerUnit: amountSchema.parse({
                amount: numberToFractionDigit(formResult.expense.amount),
                exchangedAmount: numberToFractionDigit(formResult.expense.exchangeRate * formResult.expense.amount),
                exchangeRate: numberToFractionDigit(formResult.expense.exchangeRate),
                currency: currency,
                exchangeCurrency: carCurrency
            })
        });
    }
}