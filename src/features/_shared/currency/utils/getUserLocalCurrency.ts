import { getLocales } from "expo-localization";
import { CurrencyEnum } from "../enums/currencyEnum.ts";

export function getUserLocalCurrency() {
    const locales = getLocales();
    const currencyCode = locales?.[0]?.currencyCode;
    const regionCode = locales?.[0]?.regionCode ?? "EU";

    const currencyId = Number(
        (CurrencyEnum?.[currencyCode] ?? (regionCode === "EU" ? CurrencyEnum.EUR : CurrencyEnum.USD))
    );

    return currencyId;
}