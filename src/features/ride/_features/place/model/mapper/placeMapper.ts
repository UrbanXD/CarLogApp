import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { PlaceTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { Place, placeSchema } from "../../schemas/placeSchema.ts";
import { PlaceFormFields } from "../../schemas/form/placeForm.ts";

export class PlaceMapper extends AbstractMapper<PlaceTableRow, Place> {
    toDto(entity: PlaceTableRow): Place {
        return placeSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            name: entity.name
        });
    }

    toEntity(dto: Place): PlaceTableRow {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            name: dto.name
        };
    }

    entityToPickerItem(entity: PlaceTableRow): PickerItemType {
        return {
            value: entity.id,
            title: entity.name
        };
    }

    formResultToEntity(formResult: PlaceFormFields): PlaceTableRow {
        return {
            id: formResult.id,
            owner_id: formResult.ownerId,
            name: formResult.name
        };
    }
}