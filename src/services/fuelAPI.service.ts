import axios from "axios";
const cheerio = require('cheerio');
import {getExchangeRate} from '@tamtamchik/exchanger'

class fuelAPIService {
    private readonly baseURL: string;
    private readonly dieselPriceSTR: string;
    private readonly gasolinePriceSTR: string;

    constructor() {
        this.baseURL = "https://www.globalpetrolprices.com";
        this.dieselPriceSTR = "diesel_prices";
        this.gasolinePriceSTR = "gasoline_prices";
    }

    private async getExchangeRate(from: string, to: string){
        try {
            return await getExchangeRate(from, to);
        } catch (error: any) {
            console.error(`Failed to fetch the exchange rate: ${error.message}`)
        }
    }

    private async getCountryFuelPrice(url: string, currency: string = "EUR"){
        await axios.get(url)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);

                const data = $("table")[0];
                console.log("xdd", data)
                const rows = $(data).find("tbody tr");
                const row = $(rows)[0];
                const row2 = $(rows)[1];
                const price_tag = $(row).find("td")[1];
                const currency_tag = $(row2).find("td")[2];

                return {
                    price: $(price_tag).text().trim(),
                    currency: $(currency_tag).text().trim().split("/")[0]
                }
            })
        return;
    }

    public async getGasolinePrice(countryISO: string){
        const countryName = "Serbia";
        const url = `${ this.baseURL }/${ countryName }/${ this.gasolinePriceSTR }/`;
        return await this.getCountryFuelPrice(url, "USD")
    }

    public async getDieselPrice(countryISO: string){
        const countryName = "";
        const url = `${ this.baseURL }/${ countryName }/${ this.dieselPriceSTR }`;
    }
}

export default fuelAPIService;