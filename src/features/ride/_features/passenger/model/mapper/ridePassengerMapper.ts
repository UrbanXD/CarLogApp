import { RidePassengerTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { RidePassenger, ridePassengerSchema } from "../../schemas/ridePassengerSchema.ts";

export type SelectRidePassengerTableRow = RidePassengerTableRow & { name: string | null };

export class RidePassengerMapper extends AbstractMapper<RidePassengerTableRow, RidePassenger, SelectRidePassengerTableRow> {
    async toDto(entity: SelectRidePassengerTableRow): Promise<RidePassenger> {
        return ridePassengerSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            rideLogId: entity.ride_log_id,
            passengerId: entity.passenger_id,
            name: entity.name,
            order: entity.passenger_order
        });
    }

    async toEntity(dto: RidePassenger): Promise<RidePassengerTableRow> {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            ride_log_id: dto.rideLogId,
            passenger_id: dto.passengerId,
            passenger_order: dto.order
        };
    }
}