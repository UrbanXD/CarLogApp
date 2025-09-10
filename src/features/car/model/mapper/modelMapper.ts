import { ModelTableRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { Model, modelSchema } from "../../schemas/modelSchema.ts";
import { MakeDao } from "../dao/MakeDao.ts";
import { CarModel, carModelSchema } from "../../schemas/carModelSchema.ts";

export class ModelMapper {
    constructor(private readonly makeDao: MakeDao) {}

    toModelDto(modelRow: ModelTableRow): Model {
        return modelSchema.parse({
            id: modelRow.id,
            makeId: modelRow.make_id,
            name: modelRow.name,
            startYear: modelRow.start_year,
            endYear: modelRow.end_year
        });
    }

    toModelEntity(model: Model): ModelTableRow {
        return {
            id: model.id,
            make_id: model.makeId,
            name: model.name,
            start_year: model.startYear,
            end_year: model.endYear
        };
    }

    async toCarModelDto(model: Model, modelYear: string): CarModel {
        const make = await this.makeDao.getMakeById(model.makeId);

        return carModelSchema.parse({
            id: model.id,
            make,
            name: model.name,
            year: modelYear
        });
    }
}