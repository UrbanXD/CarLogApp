import { Odometer, odometerSchema } from "../../schemas/odometerSchema.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { OdometerTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { OdometerUnitDao } from "../dao/OdometerUnitDao.ts";

export class OdometerMapper extends AbstractMapper<OdometerTableRow, Odometer> {
    private readonly odometerUnitDao: OdometerUnitDao;

    constructor(odometerUnitDao: OdometerUnitDao) {
        super();
        this.odometerUnitDao = odometerUnitDao;
    }

    async toDto(entity: OdometerTableRow): Promise<Odometer> {
        const unit = await this.odometerUnitDao.getById(entity.unit_id);

        return odometerSchema.parse({
            id: entity.id,
            carId: entity.car_id,
            unit,
            value: entity.value
        });
    }

    async toEntity(dto: Odometer): Promise<OdometerTableRow> {
        return {
            id: dto.id,
            car_id: dto.carId,
            value: dto.value,
            unit_id: dto.unit.id
        };
    }
}