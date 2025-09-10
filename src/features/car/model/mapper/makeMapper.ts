import { MakeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Make, makeSchema } from "../../schemas/makeSchema.ts";

export class MakeMapper {
    constructor() {}

    toMakeDto(makeRow: MakeTableRow): Make {
        return makeSchema.parse({
            id: makeRow.id,
            name: makeRow.name
        });
    }

    toMakeEntity(make: Make): MakeTableRow {
        return {
            id: make.id,
            name: make.name
        };
    }
}