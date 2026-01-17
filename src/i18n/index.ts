import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./locales/en-US/translations.json";
import translationHu from "./locales/hu-HU/translations.json";
import { BaseConfig } from "../constants/index.ts";
import { default as dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import weekday from "dayjs/plugin/weekday";
import updateLocale from "dayjs/plugin/updateLocale";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";
import localeData from "dayjs/plugin/localeData";

import "dayjs/locale/en";
import "dayjs/locale/hu";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(weekday);
dayjs.extend(updateLocale);
dayjs.extend(quarterOfYear);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(localeData);

dayjs.updateLocale("hu", {
    relativeTime: {
        future: "%s múlva",
        past: "%s",
        s: (n: number, s: boolean, k: string, isFuture: boolean) => `néhány másodperc${ isFuture || s ? "" : "e" }`,
        m: (n: number, s: boolean, k: string, isFuture: boolean) => `1 perc${ isFuture || s ? "" : "e" }`,
        mm: (n: number, s: boolean, k: string, isFuture: boolean) => `${ n } perc${ isFuture || s ? "" : "e" }`,
        h: (n: number, s: boolean, k: string, isFuture: boolean) => `1 ${ isFuture || s ? "óra" : "órával ezelőtt" }`,
        hh: (n: number, s: boolean, k: string, isFuture: boolean) => `${ n } ${ isFuture || s
                                                                                ? "óra"
                                                                                : "órával ezelőtt" }`,
        d: (n: number, s: boolean, k: string, isFuture: boolean) => `1 ${ isFuture || s ? "nap" : "nappal ezelőtt" }`,
        dd: (n: number, s: boolean, k: string, isFuture: boolean) => `${ n } ${ isFuture || s
                                                                                ? "nap"
                                                                                : "nappal ezelőtt" }`,
        M: (n: number, s: boolean, k: string, isFuture: boolean) => `1 ${ isFuture || s
                                                                          ? "hónap"
                                                                          : "hónappal ezelőtt" }`,
        MM: (n: number, s: boolean, k: string, isFuture: boolean) => `${ n } ${ isFuture || s
                                                                                ? "hónap"
                                                                                : "hónappal ezelőtt" }`,
        y: (n: number, s: boolean, k: string, isFuture: boolean) => `1 ${ isFuture || s ? "év" : "évvel ezelőtt" }`,
        yy: (n: number, s: boolean, k: string, isFuture: boolean) => `${ n } ${ isFuture || s
                                                                                ? "év"
                                                                                : "évvel ezelőtt" }`
    }
});

const resources = {
    "en-US": { translation: translationEn },
    en: { translation: translationEn },
    "hu-HU": { translation: translationHu },
    hu: { translation: translationHu }
};

i18n.use(initReactI18next);

export async function initI18n() {
    let selectedLanguage = "en-US";

    try {
        const savedLanguage = await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_LANGUAGE);

        if(savedLanguage) {
            selectedLanguage = savedLanguage;
        } else {
            const locales = Localization.getLocales();
            const deviceLocale = locales[0]?.languageTag;

            if(deviceLocale) {
                const languageCode = deviceLocale.split("-")[0];

                if(deviceLocale in resources) {
                    selectedLanguage = deviceLocale;
                } else if(languageCode in resources) {
                    selectedLanguage = languageCode;
                }
            }
        }

        await i18n.init({
            resources,
            lng: selectedLanguage,
            fallbackLng: {
                "en-*": ["en-US", "en"],
                "hu-*": ["hu-HU", "hu"],
                default: ["en-US"]
            },
            interpolation: {
                escapeValue: false,
                skipOnVariables: false
            },
            react: {
                useSuspense: false
            }
        });

        if(!savedLanguage) {
            await AsyncStorage.setItem(BaseConfig.LOCAL_STORAGE_KEY_LANGUAGE, selectedLanguage);
        }

    } catch(error) {
        console.error("i18n init error:", error);

        await i18n.init({
            resources,
            lng: "en-US",
            fallbackLng: "en-US",
            interpolation: { escapeValue: false },
            react: { useSuspense: false }
        });
    }
}

initI18n();

i18n.on("languageChanged", (lng) => {
    dayjs.locale(lng.slice(0, 2));
});

export default i18n;