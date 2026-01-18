export abstract class AbstractMapper<Entity, Dto, SelectEntity = Entity> {
    abstract toDto(entity: SelectEntity): Dto;

    abstract toEntity(dto: Dto): Entity;

    toDtoArray(entities: Array<SelectEntity>): Array<Dto> {
        console.log(entities.length);
        return entities.map(entity => this.toDto(entity));
    }

    toEntityArray(dtos: Array<Dto>): Array<Entity> {
        return dtos.map(dto => this.toEntity(dto));
    }
}