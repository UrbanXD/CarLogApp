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
import { Odometer } from "../../../../../car/_features/odometer/schemas/odometerSchema.ts";
import { Expense } from "../../../../schemas/expenseSchema.ts";
import { ServiceType } from "../../schemas/serviceTypeSchema.ts";
import { ServiceLogFields } from "../../schemas/form/serviceLogForm.ts";
import { OdometerUnitDao } from "../../../../../car/_features/odometer/model/dao/OdometerUnitDao.ts";
import { ExpenseTypeEnum } from "../../../../model/enums/ExpenseTypeEnum.ts";
import { ExpenseTypeDao } from "../../../../model/dao/ExpenseTypeDao.ts";
import { numberToFractionDigit } from "../../../../../../utils/numberToFractionDigit.ts";
import { OdometerLogTypeEnum } from "../../../../../car/_features/odometer/model/enums/odometerLogTypeEnum.ts";
import { convertOdometerValueToKilometer } from "../../../../../car/_features/odometer/utils/convertOdometerUnit.ts";
import { ServiceItemDao } from "../dao/ServiceItemDao.ts";
import { ServiceItem } from "../../schemas/serviceItemSchema.ts";
import { Amount } from "../../../../../_shared/currency/schemas/amountSchema.ts";
import { OdometerUnit } from "../../../../../car/_features/odometer/schemas/odometerUnitSchema.ts";
import { CarDao } from "../../../../../car/model/dao/CarDao.ts";

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

    async toDto(entity: ServiceLogTableRow): Promise<ServiceLog> {
        const [expense, odometer, serviceType, serviceTotalAmount, serviceItems]: [Expense | null, Odometer | null, ServiceType | null, Array<Amount>, Array<ServiceItem>] = await Promise.all(
            [
                (async () => {
                    if(!entity.expense_id) return null;
                    return this.expenseDao.getById(entity.expense_id, false);
                })(),
                (async () => {
                    if(!entity.odometer_log_id) return null;
                    return this.odometerLogDao.getOdometerByLogId(entity.odometer_log_id, entity.car_id);
                })(),
                this.serviceTypeDao.getById(entity.service_type_id),
                this.serviceItemDao.getTotalAmountByServiceLogId(entity.id),
                this.serviceItemDao.getAllByServiceLogId(entity.id)
            ]);

        return serviceLogSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            expense: expense,
            odometer: odometer,
            serviceType: serviceType,
            items: serviceItems,
            totalAmount: serviceTotalAmount
        });
    }

    async toEntity(dto: ServiceLog): Promise<ServiceLogTableRow> {
        return {
            id: dto.id,
            car_id: dto.carId,
            expense_id: dto.expense?.id ?? null,
            odometer_log_id: dto.odometer?.id ?? null,
            service_type_id: dto.serviceType.id
        };
    }

    async formResultToEntities(formResult: ServiceLogFields): Promise<{
        serviceLog: ServiceLogTableRow,
        serviceItems: Map<string, ServiceItemTableRow>,
        expense: ExpenseTableRow,
        odometerLog: OdometerLogTableRow | null
    }> {

        const [odometerUnit, expenseTypeId, carCurrencyId]: [OdometerUnit, string | null, number | null] = await Promise.all(
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