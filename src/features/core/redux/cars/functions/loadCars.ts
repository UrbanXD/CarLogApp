import {createAsyncThunk} from "@reduxjs/toolkit";
import {Database} from "../../../utils/database/Database";
import {CarDAO} from "../../../utils/DAOs/CarDAO";
import {encode} from "base64-arraybuffer";

export const loadCars = createAsyncThunk(
    "cars",
    async (database: Database, { rejectWithValue }) => {
        try {
            const {
                db,
                attachmentQueue
            } = database;

            const carDAO = new CarDAO(db);
            const cars = await carDAO.getCars();

            return await Promise.all(
                cars.map(async (car)=>{
                        let image = undefined;
                        if(car.image && attachmentQueue){
                            const file = await attachmentQueue.getFile(car.image);
                            image = file ? encode(file) : undefined;
                        }
                        return {
                            ...car,
                            image
                        }
                    }
                )
            );
        } catch (e) {
            console.log(e);
            return rejectWithValue("");
        }
    }
);