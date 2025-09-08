import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType, ModelTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { ModelMapper } from "../mapper/index.ts";
import { MODEL_TABLE } from "../../../../database/connector/powersync/tables/model.ts";
import { Model } from "../../schemas/modelSchema.ts";
import { MakeDao } from "./MakeDao.ts";

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
}