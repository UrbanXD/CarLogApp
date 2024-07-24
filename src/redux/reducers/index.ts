import {combineReducers} from "@reduxjs/toolkit";
import competitionReducer from "./competition/competition.slices";

const rootReducer = combineReducers({
    competition: competitionReducer,
});

export default rootReducer;