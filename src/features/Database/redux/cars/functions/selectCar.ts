import {createAsyncThunk} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LOCAL_STORAGE_KEYS} from "../../../../Shared/constants/constants";

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