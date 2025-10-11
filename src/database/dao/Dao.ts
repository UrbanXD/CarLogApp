import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { AbstractMapper } from "./AbstractMapper.ts";

export class Dao<Entity, Dto, Mapper> {
    protected readonly db: Kysely<DatabaseType>;
    protected readonly table: keyof DatabaseType;
    readonly mapper: Mapper<Entity, Dto>;

    constructor(db: Kysely<DatabaseType>, table: keyof DatabaseType, mapper: AbstractMapper<Entity, Dto>) {
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

    async getById(id: string | number, safe?: boolean = true): Promise<Dto | null> {
        const entity = await this.db
        .selectFrom(this.table)
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();

        if(safe && !entity) throw new Error(`Table item not found by ${ id } id. [${ this.table }]`);

        return entity ? await this.mapper.toDto(entity) : null;
    }

    async create(entity: Partial<Entity>, safe?: boolean): Promise<Dto | null> {
        const result = await this.db
        .insertInto(this.table)
        .values(entity)
        .returning("id")
        .executeTakeFirst();

        if(safe && !result?.id) throw new Error(`Table item not found by ${ entity?.id } id. [${ this.table }]`);
        if(!result?.id) return null;

        return await this.getById(result.id, safe);
    }

    async update(entity: Partial<Entity> & { id: string | number }, safe?: boolean): Promise<Dto | null> {
        const result = await this.db
        .updateTable(this.table)
        .set(entity)
        .where("id", "=", entity.id)
        .returning("id")
        .executeTakeFirst();

        if(safe && !result?.id) throw new Error(`Table item not found by ${ entity.id } id. [${ this.table }]`);
        if(!result?.id) return null;

        return await this.getById(result.id, safe);
    }

    async delete(id: string | number, safe?: boolean = true): Promise<string | number | null> {
        const result = await this.db
        .deleteFrom(this.table)
        .returning("id")
        .where("id", "=", id)
        .executeTakeFirst();

        if(safe && !result?.id) throw new Error(`Table item not found by ${ id }. [${ this.table }]`);

        return result?.id ?? null;
    }
}