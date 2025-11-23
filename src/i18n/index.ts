import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./locales/en-US/translations.json";
import translationHu from "./locales/hu-HU/translations.json";
import { BaseConfig } from "../constants/index.ts";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import "dayjs/locale/en";
import "dayjs/locale/hu";

dayjs.extend(weekday);

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