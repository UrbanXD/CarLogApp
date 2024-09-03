import {CarouselItemType} from "../../components/Carousel/Carousel";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Kysely} from "@powersync/kysely-driver";
import {CarsType, DatabaseType} from "../../db/AppSchema";
import {CarDAO} from "../../db/dao/CarDAO";

export interface CarType {
    name: string
    brand: string
    model: string
    image: string | undefined
    selected: boolean
}

interface CarsState {
    loading: boolean
    cars: Array<CarType>
    carsID: Array<string>
    selectedCarIndex: number
    loadError: boolean
}

const initialState: CarsState = {
    loading: true,
    cars: [],
    carsID: [],
    selectedCarIndex: 0,
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
                        if (!!item.selected) {
                            state.selectedCarIndex = index;
                        }

                        state.carsID = [...state.carsID, item.id];

                        return {
                            name: item.name,
                            brand: item.brand,
                            model: item.type,
                            image: undefined,
                            selected: !!item.selected
                        }
                    }) as Array<CarType>;
            })
            .addCase(addCar.fulfilled, (state, action) => {
                state.cars = [
                    ...state.cars,
                    {
                        name: action.payload.name,
                        brand: action.payload.brand,
                        model: action.payload.type,
                        image: undefined,
                        selected: !!action.payload.selected
                    }
                ] as Array<CarType>;
            })
    }
});

export default carsSlice.reducer;