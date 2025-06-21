import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";
import { EditCarFormFieldType } from "../../schemas/carSchema.ts";
import { CarDto } from "../types/index.ts";
import { toCarEntity } from "../mapper/index.ts";

interface EditCarArgs {
    database: Database;
    oldCar: CarDto;
    newCar: EditCarFormFieldType;
}

export const editCar = createAsyncThunk(
    "editCar",
    async (args: EditCarArgs, { rejectWithValue }) => {
        const {
            database: { carDAO, supabaseConnector, attachmentQueue },
            oldCar,
            newCar
        } = args;

        try {
            const { userID } = await supabaseConnector.fetchCredentials();

            let image = null;
            if(attachmentQueue && newCar.image) {
                image = await attachmentQueue.saveFile(newCar.image, userID);
            }
            if(image === newCar) newCar.image = image ? image.filename : null;

            const carDto: CarDto = {
                ...oldCar,
                ...newCar,
                image: image ? image.filename : oldCar.image ? oldCar.image : null
            };
            const car = toCarEntity(carDto);
            await carDAO.editCar(car);

            return carDto;
        } catch(e) {
            console.log(e);
            return rejectWithValue("");
        }
    }
);
