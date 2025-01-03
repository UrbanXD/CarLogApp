import {createAsyncThunk} from "@reduxjs/toolkit";
import {Database} from "../../../connector/Database";
import {CarTableType} from "../../../connector/powersync/AppSchema";
import {CarDAO} from "../../../DAOs/CarDAO";

export const editCar = createAsyncThunk(
    "editCar",
    async (args: { database: Database, car: CarTableType }, { rejectWithValue })=> {
        try {
            const carDAO = new CarDAO(args.database.db);

            await carDAO.editCar(args.car);

            return args.car;
        } catch (e) {
            console.log(e);
            return rejectWithValue("");
        }
    }
)
