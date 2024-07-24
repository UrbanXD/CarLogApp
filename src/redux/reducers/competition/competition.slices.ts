import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import footballAPIService from "../../../services/footballAPI.service";
import {fetchCompetitionByNameAndSeasonArgs} from "./competition.slices.types";
import {initialState} from "./competitions.slices.constants";

export const fetchCompetitionByNameAndSeason = createAsyncThunk(
    "competition",
    async (args: fetchCompetitionByNameAndSeasonArgs, { rejectWithValue, fulfillWithValue }) => {
        try {
            return new footballAPIService().getCompetition(args.type, args.name, args.season as string);
        } catch (e){
            return rejectWithValue("Hiba");
        }
    });

const competitionSlice = createSlice(
    {
        name: 'competition',
        initialState,
        reducers: {
        },
        extraReducers: builder => {
            builder
                .addCase(fetchCompetitionByNameAndSeason.pending, (state, action) => {
                    state.isLoading = true;
                })
                .addCase(fetchCompetitionByNameAndSeason.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.competition = action.payload;
                })
                .addCase(fetchCompetitionByNameAndSeason.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = "HIBA LEPETT FEL TE GECI";
                })
        }
    }
);

export default competitionSlice.reducer;