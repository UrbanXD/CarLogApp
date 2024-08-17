import {CarouselItemType} from "../../components/Carousel/Carousel";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Kysely} from "@powersync/kysely-driver";
import {CarsType, DatabaseType} from "../../db/AppSchema";
import {CarDAO} from "../../db/dao/CarDAO";

interface CarsState {
    loading: boolean
    cars: Array<CarouselItemType>
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
    "cars",
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
                            id: item.name,
                            image: undefined,
                            // image: item.image || undefined,
                            title: item.brand,
                            subtitle: item.type,
                            selected: !!item.selected
                        }
                    }) as Array<CarouselItemType>;
            })
            .addCase(addCar.fulfilled, (state, action) => {
                state.cars = [
                    ...state.cars,
                    {
                        id: action.payload.name,
                        image: undefined,
                        title: action.payload.brand,
                        subtitle: action.payload.type,
                        selected: !!action.payload.selected
                    }
                ] as Array<CarouselItemType>;
            })
    }
});

export default (carsSlice.reducer);