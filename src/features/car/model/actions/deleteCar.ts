import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";

export const deleteCar = createAsyncThunk(
    "deleteCar",
    async (args: { database: Database, carID: string }, { rejectWithValue })=> {
        try {
            const {
                database: { attachmentQueue, storage, carDAO },
                carID
            } = args

            const car = await carDAO.getCar(carID);
            if(car.image && attachmentQueue) {
                const imageFilename = attachmentQueue.getLocalFilePathSuffix(car.image);
                const localImageUri = attachmentQueue.getLocalUri(imageFilename);

                await storage.deleteFile(localImageUri);
            }
            await carDAO.deleteCar(carID);

            return { id: car.id };
        } catch (e) {
            console.log(e);
            return rejectWithValue("");
        }
    }
)