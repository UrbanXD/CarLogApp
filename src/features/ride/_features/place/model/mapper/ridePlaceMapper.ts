import { RidePlaceTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { RidePlace, ridePlaceSchema } from "../../schemas/ridePlaceSchema.ts";

export type SelectRidePlaceTableRow = RidePlaceTableRow & { name: string | null };

export class RidePlaceMapper extends AbstractMapper<RidePlaceTableRow, RidePlace, SelectRidePlaceTableRow> {
    async toDto(entity: SelectRidePlaceTableRow): Promise<RidePlace> {
        return ridePlaceSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            rideLogId: entity.ride_log_id,
            placeId: entity.place_id,
            name: entity.name,
            order: entity.place_order
        });
    }

    async toEntity(dto: RidePlace): Promise<RidePlaceTableRow> {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            ride_log_id: dto.rideLogId,
            place_id: dto.placeId,
            place_order: dto.order
        };
    }
}