import { CarTableRow, FuelTankTableRow, OdometerTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { getImageFromAttachmentQueue } from "../../../../database/utils/getImageFromAttachmentQueue.ts";
import { Car, carSchema } from "../../schemas/carSchema.ts";
import { MakeDao } from "../dao/MakeDao.ts";
import { ModelDao } from "../dao/ModelDao.ts";
import { OdometerDao } from "../../_features/odometer/model/dao/OdometerDao.ts";
import { FuelTankDao } from "../../_features/fuel/model/dao/FuelTankDao.ts";
import { CarFormFields } from "../../schemas/form/carForm.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";

export class CarMapper extends AbstractMapper<CarTableRow, Car> {
    constructor(
        private readonly makeDao: MakeDao,
        private readonly modelDao: ModelDao,
        private readonly odometerDao: OdometerDao,
        private readonly fuelTankDao: FuelTankDao,
        private readonly attachmentQueue?: PhotoAttachmentQueue
    ) {
        super();
    }

    async toDto(entity: CarTableRow): Promise<Car | null> {
        const image = await getImageFromAttachmentQueue(this.attachmentQueue, entity.image_url);
        const model = await this.modelDao.getModelById(entity.model_id);
        const carModel = await this.modelDao.mapper.toCarModelDto(model, entity.model_year);
        const odometer = await this.odometerDao.getByCarId(entity.id);
        const fuelTank = await this.fuelTankDao.getByCarId(entity.id);

        const { data } = carSchema.safeParse({
            id: entity.id,
            ownerId: entity.owner_id,
            name: entity.name,
            model: carModel,
            odometer,
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
            model_id: dto.model.id,
            model_year: dto.model.year,
            created_at: dto.createdAt,
            image_url: dto.image?.path ?? null
        };
    }

    formResultToCarEntities(request: CarFormFields, createdAt?: string): {
        car: CarTableRow,
        odometer: OdometerTableRow,
        fuelTank: FuelTankTableRow
    } {
        const car: CarTableRow = {
            id: request.id,
            owner_id: request.ownerId,
            name: request.name,
            model_id: request.model.id,
            model_year: request.model.year,
            image_url: request.image?.path ?? null,
            created_at: createdAt
        };

        const odometer: OdometerTableRow = {
            id: request.odometer.id,
            car_id: request.id,
            value: request.odometer.value,
            unit_id: request.odometer.unitId
        };

        const fuelTank: FuelTankTableRow = {
            id: request.fuelTank.id,
            car_id: request.id,
            type_id: request.fuelTank.typeId,
            unit_id: request.fuelTank.unitId,
            capacity: request.fuelTank.capacity,
            value: request.fuelTank.value
        };

        return { car, odometer, fuelTank };
    }
}