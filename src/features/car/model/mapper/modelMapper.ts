import { ModelTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Model, modelSchema } from "../../schemas/modelSchema.ts";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";

export class ModelMapper extends AbstractMapper<ModelTableRow, Model> {
    constructor() {
        super();
    }

    toDto(entity: ModelTableRow): Model {
        return modelSchema.parse({
            id: entity.id,
            makeId: entity.make_id,
            name: entity.name,
            startYear: entity.start_year,
            endYear: entity.end_year
        });
    }

    toEntity(dto: Model): ModelTableRow {
        return {
            id: dto.id,
            make_id: dto.makeId,
            name: dto.name,
            start_year: dto.startYear,
            end_year: dto.endYear
        };
    }

    toPickerItem(entity: ModelTableRow): PickerItemType {
        return {
            value: entity.id,
            title: entity.name
        };
    }
}