import { MakeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Make, makeSchema } from "../../schemas/makeSchema.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";

export class MakeMapper extends AbstractMapper<MakeTableRow, Make> {
    constructor() {
        super();
    }

    toDto(entity: MakeTableRow): Make {
        return makeSchema.parse({
            id: entity.id,
            name: entity.name
        });
    }

    toEntity(dto: Make): MakeTableRow {
        return {
            id: dto.id,
            name: dto.name
        };
    }

    toPickerItem(entity: MakeTableRow): PickerItemType {
        return {
            value: entity.id,
            title: entity.name
        };
    }
}