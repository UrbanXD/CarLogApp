import { CarTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { getImageFromAttachmentQueue } from "../../../../database/utils/getImageFromAttachmentQueue.ts";
import { Car, carSchema } from "../../schemas/carSchema.ts";
import { MakeDao } from "../dao/MakeDao.ts";
import { ModelDao } from "../dao/ModelDao.ts";
import { OdometerDao } from "../dao/OdometerDao.ts";
import { FuelTankDao } from "../dao/FuelTankDao.ts";

export class CarMapper {
    constructor(
        private readonly makeDao: MakeDao,
        private readonly modelDao: ModelDao,
        private readonly odometerDao: OdometerDao,
        private readonly fuelTankDao: FuelTankDao,
        private readonly attachmentQueue?: PhotoAttachmentQueue
    ) {}

    async toCarDto(carRow: CarTableRow): Promise<Car> {
        const image = await getImageFromAttachmentQueue(this.attachmentQueue, carRow.image_url);
        const model = await this.modelDao.getModelById(carRow.model_id);
        const odometer = await this.odometerDao.getOdometerByCarId(carRow.id);
        const fuelTank = await this.fuelTankDao.getFuelTankByCarId(carRow.id);

        return carSchema.parse({
            id: carRow.id,
            ownerId: carRow.owner_id,
            name: carRow.name,
            model: await this.modelDao.mapper.toCarModelDto(model, carRow.model_year),
            odometer,
            fuelTank,
            image,
            createdAt: carRow.created_at
        });
    }

    async toCarDtoArray(carRowArray: Array<CarTableRow>): Promise<Array<Car>> {
        return Promise.all(carRowArray.map(carRow => this.toCarDto(carRow)));
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
}