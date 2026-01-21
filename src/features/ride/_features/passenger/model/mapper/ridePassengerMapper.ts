import { PassengerTableRow, RidePassengerTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { RidePassenger, ridePassengerSchema } from "../../schemas/ridePassengerSchema.ts";

export type SelectRidePassengerTableRow = RidePassengerTableRow & Pick<PassengerTableRow, "name">;

export class RidePassengerMapper extends AbstractMapper<RidePassengerTableRow, RidePassenger, SelectRidePassengerTableRow> {
    toDto(entity: SelectRidePassengerTableRow): RidePassenger {
        return ridePassengerSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            rideLogId: entity.ride_log_id,
            passengerId: entity.passenger_id,
            name: entity.name,
            order: entity.passenger_order
        });
    }

    toEntity(dto: RidePassenger): RidePassengerTableRow {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            ride_log_id: dto.rideLogId,
            passenger_id: dto.passengerId,
            passenger_order: dto.order
        };
    }
}