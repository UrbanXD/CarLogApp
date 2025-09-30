import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { AbstractMapper } from "./AbstractMapper.ts";

export class Dao<Entity, Dto> {
    private readonly db: Kysely<DatabaseType>;
    private readonly table: keyof DatabaseType;
    readonly mapper: AbstractMapper<Entity, Dto>;

    protected constructor(db: Kysely<DatabaseType>, table: keyof DatabaseType, mapper: AbstractMapper<Entity, Dto>) {
        this.db = db;
        this.table = table;
        this.mapper = mapper;
    }

    async getAll(): Promise<Array<Dto>> {
        const entities = await this.db
        .selectFrom(this.table)
        .selectAll()
        .execute();

        return await this.mapper.toDtoArray(entities);
    }

    async getById(id: string | number): Promise<Dto | null> {
        const entity = await this.db
        .selectFrom(this.table)
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();

        return entity ? await this.mapper.toDto(entity) : null;
    }

    async create(entity: Entity): Promise<Dto | null> {
        const result = await this.db
        .insertInto(this.table)
        .values(entity)
        .returningAll()
        .executeTakeFirst();

        return result ? await this.mapper.toDto(result) : null;
    }

    async update(entity: (Entity | Partial<Entity>) & { id: string | number }): Promise<Dto | null> {
        const result = await this.db
        .updateTable(this.table)
        .set(entity)
        .where("id", "=", entity.id)
        .returningAll()
        .executeTakeFirst();

        return result ? await this.mapper.toDto(result) : null;
    }

    async deleteById(id: string | number): Promise<string | number | null> {
        const deletedId = await this.db
        .deleteFrom(this.table)
        .returning("id")
        .where("id", "=", id);

        return deletedId ?? null;
    }
}