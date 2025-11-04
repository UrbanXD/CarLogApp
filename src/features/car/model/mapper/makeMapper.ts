import { MakeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Make, makeSchema } from "../../schemas/makeSchema.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import { AbstractMapper } from "../../../../database/dao/AbstractMapper.ts";

export class MakeMapper extends AbstractMapper<MakeTableRow, Make> {
    constructor() {
        super();
    }

    async toDto(entity: MakeTableRow): Promise<Make> {
        return makeSchema.parse({
            id: entity.id,
            name: entity.name
        });
    }

    async toEntity(dto: Make): Promise<MakeTableRow> {
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