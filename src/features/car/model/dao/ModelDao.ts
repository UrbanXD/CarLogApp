import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ModelTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ModelMapper } from "../mapper/modelMapper.ts";
import { MODEL_TABLE } from "../../../../database/connector/powersync/tables/model.ts";
import { Model } from "../../schemas/modelSchema.ts";
import { MakeDao } from "./MakeDao.ts";
import { CursorPaginator } from "../../../../database/paginator/CursorPaginator.ts";
import { Dao } from "../../../../database/dao/Dao.ts";
import { PickerItemType } from "../../../../components/Input/picker/PickerItem.tsx";
import { MAKE_TABLE } from "../../../../database/connector/powersync/tables/make.ts";

export class ModelDao extends Dao<ModelTableRow, Model, ModelMapper> {
    constructor(db: Kysely<DatabaseType>, makeDao: MakeDao) {
        super(db, MODEL_TABLE, new ModelMapper(makeDao));
    }

    async getModelYearsById(id: string, desc?: boolean): Promise<Array<PickerItemType>> {
        const model = await this.getById(id);

        const years = {
            start: Number(model?.startYear),
            end: !model?.endYear
                 ? new Date().getFullYear()
                 : Number(model.endYear)
        };

        let result: Array<PickerItemType> = Array.from({ length: years.end - years.start + 1 }, (_, key) => {
            const year = (years.start + key).toString();

            return {
                title: year,
                value: year
            };
        });

        if(desc) result = result.reverse();

        return result;
    }

    paginatorByMakeId(
        makeId: string | undefined,
        perPage?: number = 50
    ): CursorPaginator<ModelTableRow, PickerItemType> {
        return new CursorPaginator<ModelTableRow, PickerItemType>(
            this.db,
            MODEL_TABLE,
            { cursor: [{ field: "name", order: "asc", toLowerCase: true }, { field: "id" }], defaultOrder: "asc" },
            {
                perPage,
                filterBy: makeId ? {
                    group: MAKE_TABLE,
                    filters: [{ field: "make_id", value: makeId, operator: "=" }]
                } : undefined,
                mapper: this.mapper.toPickerItem
            }
        );
    }
}