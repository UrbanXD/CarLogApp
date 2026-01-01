import {
    CarTableRow,
    FuelTankTableRow,
    OdometerChangeLogTableRow,
    OdometerLogTableRow
} from "../../../../database/connector/powersync/AppSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { Car, carSchema } from "../../schemas/carSchema.ts";
import { MakeDao } from "../dao/MakeDao.ts";
import { ModelDao } from "../dao/ModelDao.ts";
import { FuelTankDao } from "../../_features/fuel/model/dao/FuelTankDao.ts";
import { CarFormFields } from "../../schemas/form/carForm.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { OdometerLogDao } from "../../_features/odometer/model/dao/OdometerLogDao.ts";
import { OdometerUnitDao } from "../../_features/odometer/model/dao/OdometerUnitDao.ts";
import { convertOdometerValueToKilometer } from "../../_features/odometer/utils/convertOdometerUnit.ts";
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
        const model = await this.modelDao.getById(entity.model_id);
        const carModel = await this.modelDao.mapper.toCarModelDto(model, entity.model_year);

        const fuelTank = await this.fuelTankDao.getByCarId(entity.id);
        const odometer = await this.odometerLogDao.getOdometerByCarId(entity.id);

        const currency = await this.currencyDao.getById(entity.currency_id);

        const { data } = carSchema.safeParse({
            id: entity.id,
            ownerId: entity.owner_id,
            name: entity.name,
            model: carModel,
            odometer,
            currency,
            fuelTank,
            imagePath: entity.image_url,
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
            image_url: dto.image?.fileName ?? null
        };
    }

    async formResultToCarEntities(
        request: CarFormFields,
        previousCarImageUrl?: string | null,
        createdAt?: string
    ): Promise<{
        car: CarTableRow
        odometerLog: OdometerLogTableRow
        odometerChangeLog: OdometerChangeLogTableRow | null,
        fuelTank: FuelTankTableRow
    }> {
        const odometerUnit = await this.odometerUnitDao.getById(request.odometer.unitId);

        let carImage = request?.image ?? null;
        let path = request?.image?.fileName ?? null;

        if(this.attachmentQueue && carImage && previousCarImageUrl !== path) {
            const newAvatar = await this.attachmentQueue.saveFile(carImage, request.ownerId);
            path = newAvatar.filename;
        }

        if(previousCarImageUrl && previousCarImageUrl !== path) {
            await this.attachmentQueue?.deleteFile(previousCarImageUrl);
        }

        const car: CarTableRow = {
            id: request.id,
            owner_id: request.ownerId,
            name: request.name,
            odometer_unit_id: request.odometer.unitId,
            currency_id: request.currencyId,
            model_id: request.model.id,
            model_year: request.model.year,
            image_url: path ?? null,
            created_at: createdAt
        };

        const odometerLog: OdometerLogTableRow = {
            id: request.odometer.id,
            car_id: request.id,
            type_id: OdometerLogTypeEnum.SIMPLE,
            value: convertOdometerValueToKilometer(request.odometer.value, odometerUnit?.conversionFactor)
        };

        let odometerChangeLog: OdometerChangeLogTableRow | null = null;
        if(request.odometer.odometerChangeLogId) {
            odometerChangeLog = {
                id: request.odometer.odometerChangeLogId,
                owner_id: request.ownerId,
                odometer_log_id: odometerLog.id,
                note: null,
                date: createdAt
            };
        }

        const fuelTank: FuelTankTableRow = {
            id: request.fuelTank.id,
            car_id: request.id,
            type_id: request.fuelTank.typeId,
            unit_id: request.fuelTank.unitId,
            capacity: request.fuelTank.capacity
        };

        return { car, odometerLog, odometerChangeLog: odometerChangeLog, fuelTank };
    }

    dtoToPicker(dtos: Array<Car>): Array<PickerItemType> {
        return dtos.map(dto => ({
            value: dto.id,
            title: dto.name,
            subtitle: `${ dto.model.make.name } ${ dto.model.name }`
        }));
    }
}