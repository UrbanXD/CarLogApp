export abstract class AbstractMapper<Entity, Dto> {
    abstract async toDto(entity: Entity): Promise<Dto>;

    abstract async toEntity(dto: Dto): Promise<Entity>;

    async toDtoArray(entities: Array<Entity>): Promise<Array<Dto>> {
        return Promise.all(entities.map(entity => this.toDto(entity)));
    }

    async toEntityArray(dtos: Array<Dto>): Promise<Array<Entity>> {
        return Promise.all(dtos.map(dto => this.toDto(dto)));
    }
}