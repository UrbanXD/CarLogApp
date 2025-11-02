import { FuelTankTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { FuelTank, fuelTankSchema } from "../../schemas/fuelTankSchema.ts";
import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { FuelTypeDao } from "../dao/FuelTypeDao.ts";
import { FuelUnitDao } from "../dao/FuelUnitDao.ts";

export class FuelTankMapper extends AbstractMapper<FuelTankTableRow, FuelTank> {
    private readonly fuelTypeDao: FuelTypeDao;
    private readonly fuelUnitDao: FuelUnitDao;

    constructor(fuelTypeDao: FuelTypeDao, fuelUnitDao: FuelUnitDao) {
        super();
        this.fuelTypeDao = fuelTypeDao;
        this.fuelUnitDao = fuelUnitDao;
    }

    async toDto(entity: FuelTankTableRow): Promise<FuelTank> {
        const type = await this.fuelTypeDao.getById(entity.type_id);
        const unit = await this.fuelUnitDao.getById(entity.unit_id);

        return fuelTankSchema.parse({
            id: entity.id,
            type: type,
            unit: unit,
            capacity: entity.capacity
        });
    }

    async toEntity(dto: FuelTank): Promise<FuelTankTableRow> {
        return {
            id: dto.id,
            type_id: dto.type.id,
            unit_id: dto.unit.id,
            capacity: dto.capacity
        };
    }
}