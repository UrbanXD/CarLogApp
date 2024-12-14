import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Kysely } from "@powersync/kysely-driver";
import { CarsType, DatabaseType } from "../../utils/database/powersync/AppSchema";
import { CarDAO } from "../../utils/DAOs/CarDAO";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import { Database } from "../../utils/database/Database";
import { ImageType } from "../../utils/pickImage";

export interface CarType {
    id: string
    owner: string
    name: string
    brand: string
    model: string
    odometerMeasurement: string
    odometerValue: number
    fuelType: string
    fuelMeasurement: string
    fuelTankSize: number
    image: ImageType | null
}

interface CarsState {
    loading: boolean
    cars: Array<CarType>
    carsID: Array<string>
    selectedCarID: string
    loadError: boolean
}

const initialState: CarsState = {
    loading: true,
    cars: [],
    carsID: [],
    selectedCarID: "",
    loadError: false
}

export const loadCars = createAsyncThunk(
    "cars",
    async (db: Kysely<DatabaseType>, { rejectWithValue }) => {
        try {
            const carDAO = new CarDAO(db);
            return await carDAO.getCars();
        } catch (e) {
            console.log(e)
            return rejectWithValue("")
        }
    }
);

export const addCar = createAsyncThunk(
    "addCar",
    async (args: {database: Database, car: CarType}, { rejectWithValue }) => {
        try {
            let image = null;
            if(args.database?.attachmentQueue && args.car.image){
                image = await args.database.attachmentQueue.saveFile(args.car.image, `${args.car.owner}/custom`)
            }

            const car: CarsType = {
                ...args.car,
                image: image ? image.filename : null,
            }

            const carDAO = new CarDAO(args.database.db);
            return await carDAO.addCar(car);
        } catch (e) {
            console.log(e)
            return rejectWithValue("")
        }
    }
)

export const loadSelectedCar = createAsyncThunk(
    "loadSelectedCarIndex",
    async (arg: { asd?: string } = {}, { rejectWithValue }) => {
        try {
            const id = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.selectedCarIndex);
            console.log("loadSelectedsCar ", id)
            return id ? id : "";
        } catch (e) {
            console.log("loadSelectedCar", e);
            return rejectWithValue(0);
        }
    }
)

export const selectCar = createAsyncThunk(
    "selectCar",
    async (id: string, { rejectWithValue })=> {
        try {
            await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.selectedCarIndex, id.toString());
            return id;
        } catch (e) {
            console.log(e);
            return rejectWithValue(-1);
        }
    }
)

const carsSlice = createSlice({
    name: "cars",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadCars.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadCars.rejected, (state) => {
                state.loading = false;
                state.loadError = true;
            })
            .addCase(loadCars.fulfilled, (state, action) => {
                state.loading = false;
                state.cars = action.payload
                    .map(item => {
                        state.carsID = [...state.carsID, item.id as string];
                        return {
                            id: item.id,
                            name: item.name,
                            brand: item.brand,
                            model: item.model,
                            image: item.image,
                        }
                    }) as Array<CarType>;
            })
            .addCase(addCar.fulfilled, (state, action) => {
                state.cars = [
                    ...state.cars,
                    {
                        id: action.payload.id,
                        name: action.payload.name,
                        brand: action.payload.brand,
                        model: action.payload.model,
                        image: action.payload.image,
                    }
                ] as Array<CarType>;
            })
            .addCase(loadSelectedCar.fulfilled, (state, action) => {
                state.selectedCarID = action.payload;
            })
            .addCase(loadSelectedCar.rejected, state => {
                console.log("roosz load car")
                state.selectedCarID = "";
            })
            .addCase(selectCar.fulfilled, (state, action) => {
                state.selectedCarID = action.payload;
                console.log("kivalasztas, selectCar: ", action.payload)
            })
            .addCase(selectCar.rejected, () => {
                console.log("nijncs kivalasztva HIBA")
            })
    }
});

export default carsSlice.reducer;