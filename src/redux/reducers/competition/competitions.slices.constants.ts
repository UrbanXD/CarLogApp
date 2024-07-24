import {CompetitionState} from "./competition.slices.types";

export const initialState: CompetitionState = {
    isLoading: true,
    competition: {
        name: "",
        logo: "",
        season: "",
        standings: []
    },
    error: ""
}