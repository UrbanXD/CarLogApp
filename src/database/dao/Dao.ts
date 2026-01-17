import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { AbstractMapper } from "./AbstractMapper.ts";
import { SelectQueryBuilder } from "kysely";

export class Dao<
    Entity extends { id: any },
    Dto,
    Mapper extends AbstractMapper<Entity, Dto, SelectEntity>,
    SelectEntity extends { id: any } = Entity
> {
    protected readonly db: Kysely<DatabaseType>;
    protected readonly table: keyof DatabaseType & string;
    readonly mapper: Mapper;

    constructor(
        db: Kysely<DatabaseType>,
        table: keyof DatabaseType & string,
        mapper: Mapper
    ) {
        this.db = db;
        this.table = table;
        this.mapper = mapper;
    }

    selectQuery(): SelectQueryBuilder<DatabaseType, any, SelectEntity> {
        return this.db
        .selectFrom(this.table)
        .selectAll() as any;
    }

    async getAll(): Promise<Array<Dto>> {
        const entities = await this.selectQuery().execute();
        return await this.mapper.toDtoArray(entities);
    }

    async getById(id: string | number | null, safe: boolean = true): Promise<Dto | null> {
        if(!id) {
            if(safe) throw new Error(`ID is required for ${ this.table }`);
            return null;
        }

        const entity = await this.selectQuery()
        .where(`${ this.table }.id` as any, "=", id as any)
        .executeTakeFirst() as unknown as SelectEntity;

        if(safe && !entity) throw new Error(`Table item not found by ${ id } id. [${ this.table }]`);

        return entity ? await this.mapper.toDto(entity) : null;
    }

    async create(entity: Partial<Entity>, safe: boolean = true): Promise<Dto | null> {
        const result = await this.db
        .insertInto(this.table as any)
        .values(entity as any)
        .returning("id" as any)
        .executeTakeFirst();

        const insertedId = (result as any)?.id;

        if(safe && !insertedId) throw new Error(`Failed to create item in [${ this.table }]`);
        if(!insertedId) return null;

        return await this.getById(insertedId, safe);
    }

    async update(entity: Partial<Entity> & { id: string | number }, safe: boolean = true): Promise<Dto | null> {
        const { id, ...updateData } = entity;

        const result = await this.db
        .updateTable(this.table as any)
        .set(updateData as any)
        .where("id" as any, "=", id as any)
        .returning("id" as any)
        .executeTakeFirst();

        const updatedId = (result as any)?.id;

        if(safe && !updatedId) throw new Error(`Table item not found by ${ id } id. [${ this.table }]`);
        if(!updatedId) return null;

        return await this.getById(updatedId, safe);
    }

    async delete(id: string | number | null, safe: boolean = true): Promise<string | number | null> {
        if(!id) return null;

        const result = await this.db
        .deleteFrom(this.table as any)
        .where("id" as any, "=", id as any)
        .returning("id" as any)
        .executeTakeFirst();

        const deletedId = (result as any)?.id;

        if(safe && !deletedId) throw new Error(`Table item not found by ${ id }. [${ this.table }]`);

        return deletedId ?? null;
    }
}