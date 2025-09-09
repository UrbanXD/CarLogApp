import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";
import { CarFormFields } from "../../schemas/form/carForm.ts";

type EditCarArgs = {
    database: Database
    formResult: CarFormFields
}

export const editCar = createAsyncThunk(
    "editCar",
    async (args: EditCarArgs, { rejectWithValue }) => {
        const { database: { carDao }, formResult } = args;

        try {
            const { car, odometer, fuelTank } = carDao.mapper.fromFormResultToCarEntities(formResult);

            return await carDao.editCar(car, odometer, fuelTank);
        } catch(e) {
            console.log("edit car action error: ", e);
            return rejectWithValue("");
        }
    }
);
