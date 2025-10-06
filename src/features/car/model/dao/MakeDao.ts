import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, MakeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { MakeMapper } from "../mapper/makeMapper.ts";
import { Make } from "../../schemas/makeSchema.ts";
import { MAKE_TABLE } from "../../../../database/connector/powersync/tables/make.ts";
import { CursorPaginator } from "../../../../database/paginator/CursorPaginator.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";

export class MakeDao extends Dao<MakeTableRow, Make, MakeMapper> {
    constructor(db: Kysely<DatabaseType>) {
        super(db, MAKE_TABLE, new MakeMapper());
    }

    paginator(perPage?: number = 50): CursorPaginator<MakeTableRow, PickerItemType> {
        return new CursorPaginator<MakeTableRow>(
            this.db,
            MAKE_TABLE,
            { field: ["name", "id"], order: "asc" },
            { perPage, mapper: this.mapper.toPickerItem }
        );
    }
}