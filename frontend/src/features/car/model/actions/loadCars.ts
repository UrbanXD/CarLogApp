import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";
import { toCarDtoArray } from "../mapper/index.ts";

export const loadCars = createAsyncThunk(
    "cars",
    async (database: Database, { rejectWithValue }) => {
        try {
            const {
                carDAO,
                attachmentQueue
            } = database;
            const cars = await carDAO.getCars();

            return toCarDtoArray(cars, attachmentQueue);
        } catch(e) {
            console.log(e);
            return rejectWithValue("");
        }
    }
);