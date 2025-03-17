import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../connector/Database";
import { CarTableType } from "../../../connector/powersync/AppSchema";
import { CarDAO } from "../../../DAOs/CarDAO";
import { EditCarFormFieldType } from "../../../../Form/constants/schemas/carSchema";
import getImageState from "../../../utils/getImageState";

interface EditCarArgs {
    database: Database
    oldCar: CarTableType
    newCar: EditCarFormFieldType
}

export const editCar = createAsyncThunk(
    "editCar",
    async (args: EditCarArgs, { rejectWithValue })=> {
        const { database, oldCar, newCar } = args;
        console.log(newCar)
        try {
            const carDAO = new CarDAO(database.db);

            const { userID } = await database.supabaseConnector.fetchCredentials();
            let image = null;
            if(database.attachmentQueue && newCar.image) {
                image = await database.attachmentQueue.saveFile(newCar.image, userID);
            }

            const newCarTableRow = {
                ...oldCar,
                ...newCar,
                image: image ? image.filename : null
            } as CarTableType

            await carDAO.editCar(newCarTableRow);

            const newImageState = getImageState(newCarTableRow.image ?? undefined, newCar.image?.buffer)
            return {
                car: newCarTableRow,
                image: newImageState
            };
        } catch (e) {
            console.log(e);
            return rejectWithValue("");
        }
    }
)
