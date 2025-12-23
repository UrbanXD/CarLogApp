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
            return await carDao.update(formResult);
        } catch(e) {
            console.log("edit car action error: ", e);
            return rejectWithValue("");
        }
    }
);
