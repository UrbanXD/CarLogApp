import {createAsyncThunk} from "@reduxjs/toolkit";
import {Database} from "../../../utils/database/Database";
import {CarTableType} from "../../../utils/database/powersync/AppSchema";
import {CarDAO} from "../../../utils/DAOs/CarDAO";

export const addCar = createAsyncThunk(
    "addCar",
    async (args: {database: Database, car: CarTableType}, { rejectWithValue }) => {
        try {
            const carDAO = new CarDAO(args.database.db);

            const result = await carDAO.addCar(args.car);

            if(result === null) {
                return rejectWithValue("");
            }

            return result;
        } catch (e) {
            console.log(e)
            return rejectWithValue("");
        }
    }
)