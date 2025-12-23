import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";
import { CarFormFields } from "../../schemas/form/carForm.ts";

type CreateCarArgs = {
    database: Database
    formResult: CarFormFields
}

export const createCar = createAsyncThunk(
    "createCar",
    async (args: CreateCarArgs, { rejectWithValue }) => {
        const { database: { carDao }, formResult } = args;

        try {
            return await carDao.create(formResult);
        } catch(e) {
            console.log("create car action error: ", e);
            return rejectWithValue("");
        }
    }
);