import {
    CarTableRow,
    FuelTankTableRow,
    OdometerLogTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { getImageFromAttachmentQueue } from "../../../../database/utils/getImageFromAttachmentQueue.ts";
import { Car, carSchema } from "../../schemas/carSchema.ts";
import { MakeDao } from "../dao/MakeDao.ts";
import { ModelDao } from "../dao/ModelDao.ts";
import { FuelTankDao } from "../../_features/fuel/model/dao/FuelTankDao.ts";
import { CarFormFields } from "../../schemas/form/carForm.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { OdometerLogDao } from "../../_features/odometer/model/dao/OdometerLogDao.ts";
import { odometerSchema } from "../../_features/odometer/schemas/odometerSchema.ts";
import { OdometerUnitDao } from "../../_features/odometer/model/dao/OdometerUnitDao.ts";
import {
    convertOdometerValueFromKilometer,
    convertOdometerValueToKilometer
} from "../../_features/odometer/utils/convertOdometerUnit.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { OdometerLogTypeEnum } from "../../_features/odometer/model/enums/odometerLogTypeEnum.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import { CurrencyDao } from "../../../_shared/currency/model/dao/CurrencyDao.ts";

export class CarMapper extends AbstractMapper<CarTableRow, Car> {
    constructor(
        private readonly makeDao: MakeDao,
        private readonly modelDao: ModelDao,
        private readonly odometerLogDao: OdometerLogDao,
        private readonly odometerUnitDao: OdometerUnitDao,
        private readonly fuelTankDao: FuelTankDao,
        private readonly currencyDao: CurrencyDao,
        private readonly attachmentQueue?: PhotoAttachmentQueue
    ) {
        super();
    }

    async toDto(entity: CarTableRow): Promise<Car | null> {
        const image = await getImageFromAttachmentQueue(this.attachmentQueue, entity.image_url);
        const model = await this.modelDao.getById(entity.model_id);
        const carModel = await this.modelDao.mapper.toCarModelDto(model, entity.model_year);
        const fuelTank = await this.fuelTankDao.getByCarId(entity.id);

        const odometerValue = await this.odometerLogDao.getOdometerValueInKmByCarId(entity.id);
        const odometerUnit = await this.odometerUnitDao.getById(entity.odometer_unit_id);
        const odometer = odometerSchema.parse({
            value: convertOdometerValueFromKilometer(odometerValue, odometerUnit?.conversionFactor ?? 1),
            unit: odometerUnit
        });

        const currency = await this.currencyDao.getById(entity.currency_id);

        const { data } = carSchema.safeParse({
            id: entity.id,
            ownerId: entity.owner_id,
            name: entity.name,
            model: carModel,
            odometer,
            currency,
            fuelTank,
            image,
            createdAt: entity.created_at
        });

        if(!data) return null;

        return data;
    }

    async toEntity(dto: Car): Promise<CarTableRow> {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            name: dto.name,
            odometer_unit_id: dto.odometer.unit,
            currency_id: dto.currency.id,
            model_id: dto.model.id,
            model_year: dto.model.year,
            created_at: dto.createdAt,
            image_url: dto.image?.path ?? null
        };
    }

    async formResultToCarEntities(request: CarFormFields, createdAt?: string): Promise<{
        car: CarTableRow,
        fuelTank: FuelTankTableRow
    }> {
        const odometerUnit = await this.odometerUnitDao.getById(request.odometer.unitId);

        const car: CarTableRow = {
            id: request.id,
            owner_id: request.ownerId,
            name: request.name,
            odometer_unit_id: request.odometer.unitId,
            currency_id: request.currencyId,
            model_id: request.model.id,
            model_year: request.model.year,
            image_url: request.image?.path ?? null,
            created_at: createdAt
        };

        const odometerLog: OdometerLogTableRow = {
            id: getUUID(),
            car_id: request.id,
            type_id: OdometerLogTypeEnum.SIMPLE,
            value: convertOdometerValueToKilometer(request.odometer.value, odometerUnit?.conversionFactor),
            note: "Induló Kilométeróra-állás",
            date: createdAt
        };

        const fuelTank: FuelTankTableRow = {
            id: request.fuelTank.id,
            car_id: request.id,
            type_id: request.fuelTank.typeId,
            unit_id: request.fuelTank.unitId,
            capacity: request.fuelTank.capacity,
            value: request.fuelTank.value
        };

        return { car, odometerLog, fuelTank };
    }

    dtoToPicker(dtos: Array<Car>): Array<PickerItemType> {
        return dtos.map(dto => ({
            value: dto.id,
            title: dto.name,
            subtitle: `${ dto.model.make.name } ${ dto.model.name }`
        }));
    }
}