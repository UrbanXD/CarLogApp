import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, MakeTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { MakeMapper } from "../mapper/makeMapper.ts";
import { Make } from "../../schemas/makeSchema.ts";
import { MAKE_TABLE } from "../../../../database/connector/powersync/tables/make.ts";
import { CursorPaginator } from "../../../../database/paginator/CursorPaginator.ts";

export class MakeDao {
    private readonly db: Kysely<DatabaseType>;
    readonly mapper: MakeMapper;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
        this.mapper = new MakeMapper();
    }

    async getMakeById(id: number): Promise<Make> {
        const makeRow: MakeTableRow = await this.db
        .selectFrom(MAKE_TABLE)
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

        return this.mapper.toMakeDto(makeRow);
    }

    paginator(perPage?: number = 50): CursorPaginator<MakeTableRow> {
        return new CursorPaginator<MakeTableRow>(
            this.db,
            MAKE_TABLE,
            { field: ["name", "id"], order: "asc" },
            { perPage, searchBy: "name" }
        );
    }
}