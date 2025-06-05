import { createAsyncThunk } from "@reduxjs/toolkit";
import { CarDAO } from "../../../DAOs/CarDAO";
import { Database } from "../../../connector/Database";

export const deleteCar = createAsyncThunk(
    "deleteCar",
    async (args: { database: Database, carID: string }, { rejectWithValue })=> {
        try {
            const { attachmentQueue, storage } = args.database;

            const carDAO = new CarDAO(args.database.db);
            const car= await carDAO.getCar(args.carID);

            if(car.image && attachmentQueue) {
                const imageFilename = attachmentQueue.getLocalFilePathSuffix(car.image);
                const localImageUri = attachmentQueue.getLocalUri(imageFilename);

                await storage.deleteFile(localImageUri);
            }

            await carDAO.deleteCar(args.carID);

            return car;
        } catch (e) {
            console.log(e);
            return rejectWithValue("");
        }
    }
)