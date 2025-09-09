import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ModelTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ModelMapper } from "../mapper/index.ts";
import { MODEL_TABLE } from "../../../../database/connector/powersync/tables/model.ts";
import { Model } from "../../schemas/modelSchema.ts";
import { MakeDao } from "./MakeDao.ts";
import { getToday } from "../../../../utils/getDate.ts";
import { PaginatorFactory, PaginatorType } from "../../../../database/paginator/PaginatorFactory.ts";
import { CursorPaginator } from "../../../../database/paginator/CursorPaginator.ts";

export class ModelDao {
    private readonly db: Kysely<DatabaseType>;
    readonly mapper: ModelMapper;

    constructor(db: Kysely<DatabaseType>, makeDao: MakeDao) {
        this.db = db;
        this.mapper = new ModelMapper(makeDao);
    }

    async getModelById(id: number): Promise<Model> {
        const modelRow: ModelTableRow = await this.db
        .selectFrom(MODEL_TABLE)
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

        return this.mapper.toModelDto(modelRow);
    }

    async getModelYearsById(id: number, desc?: boolean): Promise<Array<string>> {
        const model: Model = await this.getModelById(id);

        const years = {
            start: Number(model.startYear),
            end: !model?.endYear
                 ? getToday().getFullYear()
                 : Number(model.endYear)
        };

        let result = Array.from({ length: years.end - years.start + 1 }, (_, key) => (years.start + key).toString());
        if(desc) result = result.reverse();

        return result;
    }

    paginatorByMakeId(makeId: number | undefined, perPage?: number = 50): CursorPaginator<ModelTableRow> {
        return PaginatorFactory.createPaginator<ModelTableRow>(
            PaginatorType.cursor,
            this.db,
            MODEL_TABLE,
            "id",
            {
                perPage,
                filterBy: makeId ? { field: "make_id", value: makeId, operator: "=" } : undefined,
                orderBy: { field: "name", direction: "asc", toLowerCase: true },
                searchBy: "name"
            },
            "name"
        );
    }
}