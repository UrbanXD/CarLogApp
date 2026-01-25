import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import {
    ExpenseTableRow,
    OdometerLogTableRow,
    ServiceItemTableRow,
    ServiceLogTableRow
} from "../../../../../../database/connector/powersync/AppSchema.ts";
import { ServiceLog, serviceLogSchema } from "../../schemas/serviceLogSchema.ts";
import { ExpenseDao } from "../../../../model/dao/ExpenseDao.ts";
import { OdometerLogDao } from "../../../../../car/_features/odometer/model/dao/OdometerLogDao.ts";
import { ServiceTypeDao } from "../dao/ServiceTypeDao.ts";
import { ServiceLogFormFields } from "../../schemas/form/serviceLogForm.ts";
import { OdometerUnitDao } from "../../../../../car/_features/odometer/model/dao/OdometerUnitDao.ts";
import { ExpenseTypeEnum } from "../../../../model/enums/ExpenseTypeEnum.ts";
import { ExpenseTypeDao } from "../../../../model/dao/ExpenseTypeDao.ts";
import { numberToFractionDigit } from "../../../../../../utils/numberToFractionDigit.ts";
import { OdometerLogTypeEnum } from "../../../../../car/_features/odometer/model/enums/odometerLogTypeEnum.ts";
import { convertOdometerValueToKilometer } from "../../../../../car/_features/odometer/utils/convertOdometerUnit.ts";
import { ServiceItemDao } from "../dao/ServiceItemDao.ts";
import { OdometerUnit } from "../../../../../car/_features/odometer/schemas/odometerUnitSchema.ts";
import { CarDao } from "../../../../../car/model/dao/CarDao.ts";
import { SelectServiceLogTableRow } from "../dao/ServiceLogDao.ts";
import { carSimpleSchema } from "../../../../../car/schemas/carSchema.ts";

export class ServiceLogMapper extends AbstractMapper<ServiceLogTableRow, ServiceLog> {
    private readonly expenseDao: ExpenseDao;
    private readonly odometerLogDao: OdometerLogDao;
    private readonly serviceTypeDao: ServiceTypeDao;
    private readonly odometerUnitDao: OdometerUnitDao;
    private readonly expenseTypeDao: ExpenseTypeDao;
    private readonly serviceItemDao: ServiceItemDao;
    private readonly carDao: CarDao;

    constructor(
        expenseDao: ExpenseDao,
        odometerLogDao: OdometerLogDao,
        serviceTypeDao: ServiceTypeDao,
        odometerUnitDao: OdometerUnitDao,
        expenseTypeDao: ExpenseTypeDao,
        serviceItemDao: ServiceItemDao,
        carDao: CarDao
    ) {
        super();
        this.expenseDao = expenseDao;
        this.odometerLogDao = odometerLogDao;
        this.serviceTypeDao = serviceTypeDao;
        this.odometerUnitDao = odometerUnitDao;
        this.expenseTypeDao = expenseTypeDao;
        this.serviceItemDao = serviceItemDao;
        this.carDao = carDao;
    }

    toDto(entity: SelectServiceLogTableRow): ServiceLog {
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
                id: entity.expense_car_currency_id,
                key: entity.expense_car_currency_key,
                symbol: entity.expense_car_currency_symbol
            }
        });

        const expense = this.expenseDao.mapper.toDto({
            id: entity.expense_id!,
            car_id: entity.car_id,
            car_name: entity.car_name,
            car_model_id: entity.car_model_id,
            car_model_name: entity.car_model_name,
            car_model_year: entity.car_model_year,
            car_make_id: entity.car_make_id,
            car_make_name: entity.car_make_name,
            related_id: entity.id,
            type_id: entity.expense_type_id,
            type_owner_id: entity.expense_type_owner_id,
            type_key: entity.expense_type_key,
            exchange_rate: entity.expense_exchange_rate,
            amount: entity.expense_amount,
            original_amount: entity.expense_original_amount,
            currency_id: entity.expense_currency_id,
            currency_key: entity.expense_currency_key,
            currency_symbol: entity.expense_currency_symbol,
            car_currency_id: entity.expense_car_currency_id,
            car_currency_key: entity.expense_car_currency_key,
            car_currency_symbol: entity.expense_car_currency_symbol,
            date: entity.expense_date,
            note: entity.expense_note
        });

        const odometer = this.odometerLogDao.mapper.toOdometerDto({
            log_id: entity.odometer_log_id,
            log_car_id: entity.car_id,
            log_value: entity.odometer_log_value,
            unit_id: entity.odometer_unit_id,
            unit_key: entity.odometer_unit_key,
            unit_short: entity.odometer_unit_short,
            unit_conversion_factor: entity.odometer_unit_conversion_factor
        });

        const serviceType = this.serviceTypeDao.mapper.toDto({
            id: entity.service_type_id!,
            key: entity.service_type_key,
            owner_id: entity.service_type_owner_id
        });

        const items = this.serviceItemDao.mapper.toDtoArray(entity.items);

        const totalAmount = this.serviceItemDao.mapper.toTotalAmountArray(entity.totalAmount);

        return serviceLogSchema.parse({
            id: entity.id,
            car: car,
            expense: expense,
            odometer: odometer,
            serviceType: serviceType,
            items: items,
            totalAmount: totalAmount
        });
    }

    toEntity(dto: ServiceLog): ServiceLogTableRow {
        return {
            id: dto.id,
            car_id: dto.car.id,
            expense_id: dto.expense?.id ?? null,
            odometer_log_id: dto.odometer?.id ?? null,
            service_type_id: dto.serviceType.id
        };
    }

    async formResultToEntities(formResult: ServiceLogFormFields): Promise<{
        serviceLog: ServiceLogTableRow,
        serviceItems: Map<string, ServiceItemTableRow>,
        expense: ExpenseTableRow,
        odometerLog: OdometerLogTableRow | null
    }> {
        const [odometerUnit, expenseTypeId, carCurrencyId]: [OdometerUnit, string, number] = await Promise.all(
            [
                this.odometerUnitDao.getUnitByCarId(formResult.carId),
                this.expenseTypeDao.getIdByKey(ExpenseTypeEnum.SERVICE),
                this.carDao.getCarCurrencyIdById(formResult.carId)
            ]);

        let odometerLog: OdometerLogTableRow | null = null;
        if(!!formResult?.odometerValue) {
            odometerLog = {
                id: formResult.odometerLogId,
                car_id: formResult.carId,
                type_id: OdometerLogTypeEnum.SERVICE,
                value: convertOdometerValueToKilometer(formResult.odometerValue, odometerUnit.conversionFactor)
            };
        }

        const serviceLog: ServiceLogTableRow = {
            id: formResult.id,
            car_id: formResult.carId,
            expense_id: formResult.expenseId,
            odometer_log_id: odometerLog?.id ?? null,
            service_type_id: formResult.serviceTypeId
        };

        let totalAmount = 0;
        const serviceItems = new Map<string, ServiceItemTableRow>();
        for(const item of formResult.items) {
            totalAmount += item.pricePerUnit.amount * item.quantity * item.pricePerUnit.exchangeRate;
            serviceItems.set(item.id, {
                id: item.id,
                car_id: formResult.carId,
                service_log_id: serviceLog.id,
                service_item_type_id: item.type.id,
                currency_id: item.pricePerUnit.currency.id,
                exchange_rate: numberToFractionDigit(item.pricePerUnit.exchangeRate),
                quantity: item.quantity,
                price_per_unit: numberToFractionDigit(item.pricePerUnit.amount)
            });
        }

        const expense: ExpenseTableRow = {
            id: formResult.expenseId,
            car_id: formResult.carId,
            type_id: expenseTypeId,
            currency_id: carCurrencyId,
            original_amount: numberToFractionDigit(totalAmount),
            exchange_rate: 1,
            amount: numberToFractionDigit(totalAmount),
            note: formResult.note,
            date: formResult.date
        };

        return {
            serviceLog,
            serviceItems,
            expense,
            odometerLog: odometerLog
        };
    }
}