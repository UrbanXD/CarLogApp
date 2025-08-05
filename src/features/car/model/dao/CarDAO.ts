import { Kysely, sql } from "@powersync/kysely-driver";
import {
    CAR_BRAND_TABLE,
    CAR_MODEL_TABLE,
    CAR_TABLE,
    CarBrandTableType,
    CarModelTableType,
    CarTableType,
    DatabaseType
} from "../../../../database/connector/powersync/AppSchema.ts";
import { Paginator } from "../../../../types/index.ts";
import { paginate } from "../../../../database/utils/paginate.ts";

export class CarDAO {
    db: Kysely<DatabaseType>;

    constructor(db: Kysely<DatabaseType>) {
        this.db = db;
    }

    async getCar(carID: string) {
        return await this.db
        .selectFrom(CAR_TABLE)
        .selectAll()
        .where("id", "=", carID)
        .executeTakeFirstOrThrow() as unknown as CarTableType;
    }

    async getCars() {
        return await this.db
        .selectFrom(CAR_TABLE)
        .selectAll()
        .orderBy("createdAt")
        .orderBy("name")
        .execute() as unknown as Array<CarTableType>;
    }

    async addCar(car: CarTableType) {
        await this.db
        .insertInto(CAR_TABLE)
        .values(car)
        .execute();

        try {
            return await this.getCar(car.id) as unknown as CarTableType;
        } catch(e) {
            return null;
        }

    }

    async editCar(car: CarTableType) {
        await this.db
        .updateTable(CAR_TABLE)
        .set({ ...car })
        .where("id", "=", car.id)
        .executeTakeFirst();

        return car;
    }

    async deleteCar(carID: string) {
        await this.db
        .deleteFrom(CAR_TABLE)
        .where("id", "=", carID)
        .executeTakeFirstOrThrow();

        return carID;
    }

    async getCarBrands(paginator?: Paginator<CarBrandTableType>) {
        let query = this.db
        .selectFrom(CAR_BRAND_TABLE)
        .selectAll()
        .orderBy(sql`lower(name)`, "asc");

        if(paginator) query = paginate<CarBrandTableType>(this.db, CAR_BRAND_TABLE, paginator);

        return await query.execute() as unknown as Array<CarBrandTableType>;
    }

    async getCarBrandById(brandId: string) {
        return await this.db
        .selectFrom(CAR_BRAND_TABLE)
        .selectAll()
        .where("id", "=", brandId)
        .execute() as unknown as CarBrandTableType;
    }

    async updateCarBrands(carBrands: Array<CarBrandTableType>) {
        await this.db
        .deleteFrom(CAR_BRAND_TABLE)
        .execute();

        await this.db
        .insertInto(CAR_BRAND_TABLE)
        .values(carBrands)
        .execute();
    }

    async getCarModels(brandId: number | string, paginator?: Paginator<CarModelTableType>) {
        let query = await this.db
        .selectFrom(CAR_MODEL_TABLE)
        .selectAll()
        .orderBy(sql`lower(name)`, "asc");

        if(paginator) query = paginate<CarModelTableType>(this.db, CAR_MODEL_TABLE, paginator);

        return await query.where("brand", "=", brandId).execute() as unknown as Array<CarModelTableType>;
    }

    async getCarModelById(modelId: string) {
        return await this.db
        .selectFrom(CAR_MODEL_TABLE)
        .selectAll()
        .where("id", "=", modelId)
        .execute() as unknown as CarModelTableType;
    }

    async updateCarModels(carModels: Array<CarModelTableType>) {
        await this.db
        .deleteFrom(CAR_MODEL_TABLE)
        .execute();

        const CHUNK_SIZE = 1000;
        const chunks = [];
        for(let i = 0; i < carModels.length; i += CHUNK_SIZE) {
            chunks.push(carModels.slice(i, i + CHUNK_SIZE));
        }

        for(const chunk of chunks) {
            try {
                await this.db
                .insertInto(CAR_MODEL_TABLE)
                .values(chunk)
                .execute();
            } catch(e) {
                console.error("Car Model Chunk Insert Error: ", e);
            }
        }
    }

    async clear() {
        await this.db.deleteFrom(CAR_MODEL_TABLE).execute();
        await this.db.deleteFrom(CAR_BRAND_TABLE).execute();
    }

    async areCarBrandsAndModelsExists() {
        const brandsCount = await this.db
        .selectFrom(CAR_BRAND_TABLE)
        .select(eb => eb.fn.countAll<number>().as("count"))
        .executeTakeFirst();

        const modelsCount = await this.db
        .selectFrom(CAR_MODEL_TABLE)
        .select(eb => eb.fn.countAll<number>().as("count"))
        .executeTakeFirst();


        return brandsCount.count > 0 && modelsCount.count > 0;
    }
}