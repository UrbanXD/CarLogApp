import {createAsyncThunk} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LOCAL_STORAGE_KEYS} from "../../../constants/constants";

export const loadSelectedCar = createAsyncThunk(
    "loadSelectedCarIndex",
    async (arg: { asd?: string } = {}, { rejectWithValue }) => {
        try {
            const id = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.selectedCarIndex);
            return id ? id : "";
        } catch (e) {
            console.log("loadSelectedCar", e);
            return rejectWithValue(0);
        }
    }
)