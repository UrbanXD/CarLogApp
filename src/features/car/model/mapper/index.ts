import { CarDto } from "../types/index.ts";
import { CarTableType } from "../../../../database/connector/powersync/AppSchema.ts";
import { PhotoAttachmentQueue } from "../../../../database/connector/powersync/PhotoAttachmentQueue.ts";
import { getImageFromAttachmentQueue } from "../../../../database/utils/getImageFromAttachmentQueue.ts";

export const toCarDto = async (car?: CarTableType, attachmentQueue?: PhotoAttachmentQueue): CarDto => {
    if(!car) return null;

    const carImage = await getImageFromAttachmentQueue(attachmentQueue, car.image);

    return {
        id: car.id,
        owner: car.owner,
        name: car.name,
        brand: car.brand,
        model: car.model,
        odometerMeasurement: car.odometerMeasurement,
        odometerValue: car.odometerValue,
        fuelType: car.fuelType,
        fuelMeasurement: car.fuelMeasurement,
        fuelTankSize: car.fuelTankSize,
        fuelValue: car.fuelValue,
        image: carImage,
        createdAt: car.createdAt
    };
};

export const toCarDtoArray = async (
    cars?: Array<CarTableType> = [],
    attachmentQueue?: PhotoAttachmentQueue
): Array<CarDto> => {
    return await Promise.all(
        cars.map(async (car) => await toCarDto(car, attachmentQueue))
    );
};

export const toCarEntity = (carDto: CarDto): CarTableType => {
    return {
        id: carDto.id,
        owner: carDto.owner,
        name: carDto.name,
        brand: carDto.brand,
        model: carDto.model,
        odometerMeasurement: carDto.odometerMeasurement,
        odometerValue: carDto.odometerValue,
        fuelType: carDto.fuelType,
        fuelMeasurement: carDto.fuelMeasurement,
        fuelTankSize: carDto.fuelTankSize,
        image: carDto.image?.path ?? null,
        createdAt: carDto.createdAt
    };
};