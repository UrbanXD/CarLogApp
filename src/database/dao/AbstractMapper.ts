export abstract class AbstractMapper<Entity, Dto, SelectEntity = Entity> {
    abstract toDto(entity: SelectEntity): Promise<Dto>;

    abstract toEntity(dto: Dto): Promise<Entity>;

    async toDtoArray(entities: Array<SelectEntity>): Promise<Array<Dto>> {
        return Promise.all(entities.map(entity => this.toDto(entity)));
    }

    async toEntityArray(dtos: Array<Dto>): Promise<Array<Entity>> {
        return Promise.all(dtos.map(dto => this.toEntity(dto)));
    }
}