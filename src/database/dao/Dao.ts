import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { AbstractMapper } from "./AbstractMapper.ts";
import { SelectQueryBuilder } from "kysely";
import { AbstractPowerSyncDatabase } from "@powersync/react-native";

export class Dao<
    Entity extends { id: string | number },
    Dto,
    Mapper extends AbstractMapper<Entity, Dto, SelectEntity>,
    SelectEntity extends { id: string | number } = Entity
> {
    protected readonly db: Kysely<DatabaseType>;
    protected readonly powersync: AbstractPowerSyncDatabase;
    protected readonly table: keyof DatabaseType & string;
    readonly mapper: Mapper;

    constructor(
        db: Kysely<DatabaseType>,
        powersync: AbstractPowerSyncDatabase,
        table: keyof DatabaseType & string,
        mapper: Mapper
    ) {
        this.db = db;
        this.powersync = powersync;
        this.table = table;
        this.mapper = mapper;
    }

    selectQuery(id?: any | null): SelectQueryBuilder<DatabaseType, any, SelectEntity> {
        let query = this.db
        .selectFrom(this.table)
        .selectAll();

        if(id) query = query.where(`${ this.table }.id`, "=", id as any);

        return query as any;
    }

    async getAll(): Promise<Array<Dto>> {
        const entities = await this.selectQuery().execute();
        return this.mapper.toDtoArray(entities);
    }

    async getById(id: string | number | null): Promise<Dto> {
        if(!id) throw new Error(`ID is required for ${ this.table }`);

        const entity = await this.selectQuery(id)
        .executeTakeFirstOrThrow() as unknown as SelectEntity;


        return this.mapper.toDto(entity);
    }

    async create(entity: Entity): Promise<Entity["id"]> {
        const result = await this.db
        .insertInto(this.table as any)
        .values(entity as any)
        .returning("id" as any)
        .executeTakeFirst();

        const insertedId = (result as any)?.id;
        if(!insertedId) throw new Error(`Failed to create item in [${ this.table }]`);

        return insertedId;
    }

    async update(entity: Partial<Entity> & Pick<Entity, "id">): Promise<Entity["id"]> {
        const { id, ...updateData } = entity;

        const result = await this.db
        .updateTable(this.table)
        .set(updateData)
        .where("id", "=", id as any)
        .returning("id")
        .executeTakeFirst();

        const updatedId = result?.id;
        if(!updatedId) throw new Error(`Table item not found by ${ id } id. [${ this.table }]`);

        return updatedId;
    }

    async delete(id: string | number | null): Promise<Entity["id"]> {
        if(!id) throw new Error(`Table item not found by ${ id }. [${ this.table }]`);

        const result = await this.db
        .deleteFrom(this.table)
        .where("id", "=", id as any)
        .returning("id")
        .executeTakeFirst();

        const deletedId = result?.id;
        if(!deletedId) throw new Error(`Table item not found by ${ id }. [${ this.table }]`);

        return deletedId;
    }
}