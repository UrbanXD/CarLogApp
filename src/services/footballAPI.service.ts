import {callAPI} from "../utils/callAPI";
import {CompetitionType} from "./footballAPI.types";

class footballAPIService {
    private readonly baseURL: string;

    constructor() {
        this.baseURL = 'https://hungarianfootballapi.onrender.com';
    }

    public async getCompetition(competition_type: CompetitionType , competition_name: string, season?: string) {
        const url = `${ this.baseURL }/${ competition_type }/${ competition_name }?id=${ season || '' }`;
        const response = await callAPI(url);
        if(response.status === 404){
            throw new Error("hiba");
        }
        return response;
    }
}

export default footballAPIService;
