import {CarouselItemType} from "../../components/Carousel/Carousel";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Kysely} from "@powersync/kysely-driver";
import {CarsType, DatabaseType} from "../../db/AppSchema";
import {CarDAO} from "../../db/dao/CarDAO";
import {LOCAL_STORAGE_KEYS} from "../../constants/constants";

export interface CarType {
    id: string
    name: string
    brand: string
    model: string
    image: string | undefined
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
    async (db: Kysely<DatabaseType>, { rejectWithValue, fulfillWithValue }) => {
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
    async (args: {db: Kysely<DatabaseType>, car: CarsType}, { rejectWithValue, fulfillWithValue }) => {
        try {
            const carDAO = new CarDAO(args.db);
            return await carDAO.addCar(args.car);
        } catch (e) {
            console.log(e)
            return rejectWithValue("")
        }
    }
)

export const loadSelectedCar = createAsyncThunk(
    "loadSelectedCarIndex",
    async (arg: { asd?: string } = {}, { rejectWithValue, fulfillWithValue }) => {
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
    async (id: string, { rejectWithValue, fulfillWithValue })=> {
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
            .addCase(loadCars.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(loadCars.rejected, (state, action) => {
                state.loading = false;
                state.loadError = true;
            })
            .addCase(loadCars.fulfilled, (state, action) => {
                state.loading = false;
                state.cars = action.payload
                    .map((item, index) => {
                        state.carsID = [...state.carsID, item.id];
                        return {
                            id: item.id,
                            name: item.name,
                            brand: item.brand,
                            model: item.model,
                            image: undefined,
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
                        image: undefined,
                    }
                ] as Array<CarType>;
            })
            .addCase(loadSelectedCar.fulfilled, (state, action) => {
                state.selectedCarID = action.payload;
            })
            .addCase(loadSelectedCar.rejected, (state, action) => {
                console.log("roosz load car")
                state.selectedCarID = "";
            })
            .addCase(selectCar.fulfilled, (state, action) => {
                state.selectedCarID = action.payload;
                console.log("kivalasztas, selectCar: ", action.payload)
            })
            .addCase(selectCar.rejected, (state, action) => {
                console.log("nijncs kivalasztva HIBA")
            })
    }
});

export default carsSlice.reducer;