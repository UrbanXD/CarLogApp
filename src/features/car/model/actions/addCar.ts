import { createAsyncThunk } from "@reduxjs/toolkit";
import { Database } from "../../../../database/connector/Database.ts";
import { CarTableType } from "../../../../database/connector/powersync/AppSchema.ts";
import { getUUID } from "../../../../database/utils/uuid.ts";
import { AddCarFormFieldType } from "../../schemas/carSchema.ts";
import { toCarDto } from "../mapper/index.ts";

interface AddCarArgs {
    database: Database;
    car: AddCarFormFieldType;
}

export const addCar = createAsyncThunk(
    "addCar",
    async (args: AddCarArgs, { rejectWithValue }) => {
        const {
            database: { carDAO, supabaseConnector, attachmentQueue },
            car
        } = args;

        try {
            const { userID } = await supabaseConnector.fetchCredentials();
            const { brandId, modelId, ...restCar } = car;

            let image = null;
            if(attachmentQueue && car.image) {
                image = await attachmentQueue.saveFile(car.image, userID);
            }

            const { name: brand } = await carDAO.getCarBrandById(brandId);
            const { name: model } = await carDAO.getCarModelById(modelId);

            const newCarTableRow: CarTableType = {
                ...restCar,
                id: getUUID(),
                owner: userID,
                brand,
                model,
                image: image ? image.filename : null,
                createdAt: Date.now().toString()
            };

            const result = await carDAO.addCar(newCarTableRow);
            if(result) return await toCarDto(result, attachmentQueue);

            //toroljuk a kepet majd a jovoben
            return rejectWithValue("");
        } catch(e) {
            console.log(e);
            return rejectWithValue("");
        }
    }
);