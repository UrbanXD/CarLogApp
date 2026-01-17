import { getLocales } from "expo-localization";
import { CurrencyEnum } from "../enums/currencyEnum.ts";

export function getUserLocalCurrency() {
    const locales = getLocales();
    const currencyCode = locales?.[0]?.currencyCode;
    const regionCode = locales?.[0]?.regionCode ?? "EU";

    const defaultCurrency = regionCode === "EU" ? CurrencyEnum.EUR : CurrencyEnum.USD;

    const isValidKey = currencyCode && currencyCode in CurrencyEnum;
    const currencyId = isValidKey
                       ? CurrencyEnum[currencyCode as keyof typeof CurrencyEnum]
                       : defaultCurrency;

    return Number(currencyId);
}