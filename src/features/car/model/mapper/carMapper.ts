import { CarTableRow, FuelTankTableRow, OdometerTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { getImageFromAttachmentQueue } from "../../../../database/utils/getImageFromAttachmentQueue.ts";
import { Car, carSchema } from "../../schemas/carSchema.ts";
import { MakeDao } from "../dao/MakeDao.ts";
import { ModelDao } from "../dao/ModelDao.ts";
import { OdometerDao } from "../../_features/odometer/model/dao/OdometerDao.ts";
import { FuelTankDao } from "../../_features/fuel/model/dao/FuelTankDao.ts";
import { CarFormFields, carFormSchema } from "../../schemas/form/carForm.ts";

export class CarMapper {
    constructor(
        private readonly makeDao: MakeDao,
        private readonly modelDao: ModelDao,
        private readonly odometerDao: OdometerDao,
        private readonly fuelTankDao: FuelTankDao,
        private readonly attachmentQueue?: PhotoAttachmentQueue
    ) {}

    async toCarDto(carRow: CarTableRow): Promise<Car | null> {
        const image = await getImageFromAttachmentQueue(this.attachmentQueue, carRow.image_url);
        const model = await this.modelDao.getModelById(carRow.model_id);
        const odometer = await this.odometerDao.getOdometerByCarId(carRow.id);
        const fuelTank = await this.fuelTankDao.getFuelTankByCarId(carRow.id);

        const { data } = carSchema.safeParse({
            id: carRow.id,
            ownerId: carRow.owner_id,
            name: carRow.name,
            model: await this.modelDao.mapper.toCarModelDto(model, carRow.model_year),
            odometer,
            fuelTank,
            image,
            createdAt: carRow.created_at
        });

        if(!data) return null;

        return data;
    }

    async toCarDtoArray(carRowArray: Array<CarTableRow>): Promise<Array<Car>> {
        return (await Promise.all(carRowArray.map(carRow => this.toCarDto(carRow)))).filter(element => element !== null);
    }

    toCarEntity(car: Car): CarTableRow {
        return {
            id: car.id,
            owner_id: car.ownerId,
            name: car.name,
            model_id: car.model.id,
            model_year: car.model.year,
            created_at: car.createdAt,
            image_url: car.image?.path ?? null
        };
    }

    fromFormResultToCarEntities(formResult: CarFormFields, createdAt?: string): {
        car: CarTableRow,
        odometer: OdometerTableRow,
        fuelTank: FuelTankTableRow
    } {
        const request = carFormSchema.parse(formResult);

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
            unit: request.odometer.unit
        };

        const fuelTank: FuelTankTableRow = {
            id: request.fuelTank.id,
            car_id: request.id,
            type: request.fuelTank.type,
            capacity: request.fuelTank.capacity,
            value: request.fuelTank.value,
            unit: request.fuelTank.unit
        };

        return { car, odometer, fuelTank };
    }
}