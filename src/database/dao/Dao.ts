import { Kysely } from "@powersync/kysely-driver";
import { DatabaseType } from "../connector/powersync/AppSchema.ts";
import { AbstractMapper } from "./AbstractMapper.ts";

export class Dao<Entity, Dto, Mapper> {
    protected cache = new Map<string | number, Dto>();
    protected readonly db: Kysely<DatabaseType>;
    protected readonly table: keyof DatabaseType;
    readonly mapper: Mapper<Entity, Dto>;

    constructor(db: Kysely<DatabaseType>, table: keyof DatabaseType, mapper: AbstractMapper<Entity, Dto>) {
        this.db = db;
        this.table = table;
        this.mapper = mapper;
    }

    async getAll(useCache?: boolean = true): Promise<Array<Dto>> {
        if(useCache && this.cache.size > 0) return [...this.cache.values()];

        const entities = await this.db
        .selectFrom(this.table)
        .selectAll()
        .execute();

        const dtos = await this.mapper.toDtoArray(entities);
        for(const dto of dtos) this.cache.set(dto.id, dto);

        return dtos;
    }

    async getById(id: string | number, safe?: boolean = true): Promise<Dto | null> {
        if(this.cache.has(id)) return this.cache.get(id)!;

        const entity = await this.db
        .selectFrom(this.table)
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst();

        if(safe && entity === null) throw new Error(`Table item not found by ${ id } id. [${ this.table }]`);

        return entity ? await this.mapper.toDto(entity) : null;
    }

    async create(entity: Entity): Promise<Dto | null> {
        const result = await this.db
        .insertInto(this.table)
        .values(entity)
        .returningAll()
        .executeTakeFirst();

        const dto = result ? await this.mapper.toDto(result) : null;

        if(dto) this.cache.set(dto.id, dto);

        return dto;
    }

    async update(entity: (Entity | Partial<Entity>) & { id: string | number }): Promise<Dto | null> {
        const result = await this.db
        .updateTable(this.table)
        .set(entity)
        .where("id", "=", entity.id)
        .returningAll()
        .executeTakeFirst();

        const dto = result ? await this.mapper.toDto(result) : null;

        if(dto) this.cache.set(dto.id, dto);

        return dto;
    }

    async delete(id: string | number): Promise<string | number | null> {
        const deletedId = await this.db
        .deleteFrom(this.table)
        .returning("id")
        .where("id", "=", id)
        .execute();

        if(deletedId) this.cache.delete(deletedId);

        return deletedId ?? null;
    }
}