import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";
import { OdometerLogFields } from "../../schemas/form/odometerLogForm.ts";

type CreateOdometerLogArgs = {
    database: Database
    formResult: OdometerLogFields
}
export const createOdometerLog = createAsyncThunk(
    "createOdometerLog",
    async (args: CreateOdometerLogArgs, { rejectWithValue }) => {
        const { database: { odometerLogDao }, formResult } = args;

        try {
            const odometerLogRow = odometerLogDao.mapper.fromFormResultToOdometerLogEntity(formResult);

            return await odometerLogDao.createOdometerLog(odometerLogRow);
        } catch(e) {
            console.log("create odometer log action error: ", e);
            return rejectWithValue("");
        }
    }
);