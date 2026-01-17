import { ModelTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Model, modelSchema } from "../../schemas/modelSchema.ts";
import { MakeDao } from "../dao/MakeDao.ts";
import { CarModel, carModelSchema } from "../../schemas/carModelSchema.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";

export class ModelMapper extends AbstractMapper<ModelTableRow, Model> {
    constructor(private readonly makeDao: MakeDao) {
        super();
    }

    async toDto(entity: ModelTableRow): Promise<Model> {
        return modelSchema.parse({
            id: entity.id,
            makeId: entity.make_id,
            name: entity.name,
            startYear: entity.start_year,
            endYear: entity.end_year
        });
    }

    async toEntity(dto: Model): Promise<ModelTableRow> {
        return {
            id: dto.id,
            make_id: dto.makeId,
            name: dto.name,
            start_year: dto.startYear,
            end_year: dto.endYear
        };
    }

    async toCarModelDto(model: Model, modelYear: string): Promise<CarModel> {
        const make = await this.makeDao.getById(model.makeId);

        return carModelSchema.parse({
            id: model.id,
            make,
            name: model.name,
            year: modelYear
        });
    }

    toPickerItem(entity: ModelTableRow): PickerItemType {
        return {
            value: entity.id,
            title: entity.name
        };
    }
}