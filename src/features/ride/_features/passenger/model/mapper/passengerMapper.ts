import { AbstractMapper } from "../../../../../../database/dao/AbstractMapper.ts";
import { PassengerTableRow } from "../../../../../../database/connector/powersync/AppSchema.ts";
import { PickerItemType } from "../../../../../../components/Input/picker/PickerItem.tsx";
import { Passenger, passengerSchema } from "../../schemas/passengerSchema.ts";
import { PassengerFormFields } from "../../schemas/form/passengerForm.ts";

export class PassengerMapper extends AbstractMapper<PassengerTableRow, Passenger> {
    toDto(entity: PassengerTableRow): Passenger {
        return passengerSchema.parse({
            id: entity.id,
            ownerId: entity.owner_id,
            name: entity.name
        });
    }

    toEntity(dto: Passenger): PassengerTableRow {
        return {
            id: dto.id,
            owner_id: dto.ownerId,
            name: dto.name
        };
    }

    toPickerItem(entity: PassengerTableRow): PickerItemType {
        return {
            value: entity.id,
            title: entity.name
        };
    }

    formResultToEntity(formResult: PassengerFormFields): PassengerTableRow {
        return {
            id: formResult.id,
            owner_id: formResult.ownerId,
            name: formResult.name
        };
    }
}