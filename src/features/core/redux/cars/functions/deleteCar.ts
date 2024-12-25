import {createAsyncThunk} from "@reduxjs/toolkit";
import {Database} from "../../../utils/database/Database";
import {CarDAO} from "../../../utils/DAOs/CarDAO";

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

            return await carDAO.deleteCar(args.carID);
        } catch (e) {
            console.log(e);
            return rejectWithValue("");
        }
    }
)