import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../connector/Database";
import { CarTableType } from "../../../connector/powersync/AppSchema";
import { CarDAO } from "../../../DAOs/CarDAO";
import { AddCarFormFieldType } from "../../../../Form/constants/schemas/carSchema";
import { getUUID } from "../../../utils/uuid";
import getImageState from "../../../utils/getImageState";

interface AddCarArgs {
    database: Database
    car: AddCarFormFieldType
}

export const addCar = createAsyncThunk(
    "addCar",
    async (args: AddCarArgs, { rejectWithValue }) => {
        const { database, car } = args;

        try {
            const carDAO = new CarDAO(args.database.db);

            const { userID } = await database.supabaseConnector.fetchCredentials();
            let image = null;
            if(database.attachmentQueue && car.image) {
                image = await database.attachmentQueue.saveFile(car.image, userID);
            }

            const newCarTableRow: CarTableType = {
                ...car,
                id: getUUID(),
                owner: userID,
                image: image ? image.filename : null,
                createdAt: Date.now().toString(),
            }

            const result = await carDAO.addCar(newCarTableRow);
            if(result === null) return rejectWithValue("");

            return {
                car: result,
                image: getImageState(newCarTableRow.image ?? undefined, car.image?.buffer)
            };
        } catch (e) {
            console.log(e)
            return rejectWithValue("");
        }
    }
)