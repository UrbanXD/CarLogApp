import {League} from "../../../interfaces/StandingProp";
import {CompetitionType} from "../../../services/footballAPI.types";

export type CompetitionState = {
    isLoading: boolean,
    competition: League,
    error: string
}

export type fetchCompetitionByNameAndSeasonArgs = {
    type: CompetitionType,
    name: string,
    season: number | string
}