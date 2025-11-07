import { RidePassengerTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { RidePassenger, ridePassengerSchema } from "../../schemas/ridePassengerSchema.ts";
import { PassengerDao } from "../dao/passengerDao.ts";

export class RidePassengerMapper extends AbstractMapper<RidePassengerTableRow, RidePassenger> {
    private readonly passengerDao: PassengerDao;

    constructor(passengerDao: PassengerDao) {
        super();
        this.passengerDao = passengerDao;
    }

    async toDto(entity: RidePassengerTableRow): Promise<RidePassenger> {
        const place = await this.placeDao.getById(entity.passenger_id);

        return ridePassengerSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            rideLogId: entity.ride_log_id,
            passengerId: entity.passenger_id,
            name: place?.name,
            order: entity.passenger_order
        });
    }

    toEntity(dto: RidePassenger): RidePassengerTableRow {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            ride_log_id: dto.rideLogId,
            passenger_id: dto.passengerId,
            name: dto.name,
            passenger_order: dto.order
        };
    }
}