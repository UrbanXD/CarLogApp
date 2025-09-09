import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";
import { CarTableRow, InsertableFuelTankRow } from "../../../../database/connector/powersync/AppSchema.ts";
import { CreateCarRequest } from "../../schemas/form/createCarRequest.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";

type CreateCarArgs = {
    database: Database
    request: CreateCarRequest
}

export const createCar = createAsyncThunk(
    "createCar",
    async (args: CreateCarArgs, { rejectWithValue }) => {
        const { database: { carDao }, request } = args;

        try {
            const carId = getUUID();

            const car: CarTableRow = {
                id: carId,
                owner_id: request.ownerId,
                name: request.name,
                model_id: request.model.id,
                model_year: request.model.year,
                image_url: request.image?.path ?? null,
                created_at: new Date().toISOString()
            };

            const odometer = {
                id: getUUID(),
                car_id: carId,
                value: request.odometer.value,
                measurement: request.odometer.measurement
            };

            const fuelTank: InsertableFuelTankRow = {
                id: getUUID(),
                car_id: carId,
                type: request.fuelTank.type,
                capacity: request.fuelTank.capacity,
                value: request.fuelTank.value,
                measurement: request.fuelTank.measurement
            };

            return await carDao.createCar(car, odometer, fuelTank);
        } catch(e) {
            console.log("create car action error: ", e);
            return rejectWithValue("");
        }
    }
);