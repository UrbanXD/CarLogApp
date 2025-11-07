import { RidePlaceTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { RidePlace, ridePlaceSchema } from "../../schemas/ridePlaceSchema.ts";
import { PlaceDao } from "../dao/placeDao.ts";

export class RidePlaceMapper extends AbstractMapper<RidePlaceTableRow, RidePlace> {
    private readonly placeDao: PlaceDao;

    constructor(placeDao: PlaceDao) {
        super();
        this.placeDao = placeDao;
    }

    async toDto(entity: RidePlaceTableRow): Promise<RidePlace> {
        const place = await this.placeDao.getById(entity.place_id);

        return ridePlaceSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            rideLogId: entity.ride_log_id,
            placeId: entity.place_id,
            name: place?.name,
            order: entity.place_order
        });
    }

    toEntity(dto: RidePlace): RidePlaceTableRow {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            ride_log_id: dto.rideLogId,
            place_id: dto.placeId,
            name: dto.name,
            place_order: dto.order
        };
    }
}