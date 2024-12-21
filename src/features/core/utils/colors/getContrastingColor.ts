import { ColorValue } from "react-native";
import hexToRGBA from "./hexToRGBA";

//https://24ways.org/2010/calculating-color-contrast
const getContrastingColor = (inputColor: ColorValue, light: ColorValue, dark: ColorValue) => {
    const RGBA = hexToRGBA(inputColor as string, 1, true);

    if(typeof RGBA === "string"){
        return light;
    }

    const yiq = (RGBA[0] * 2126 + RGBA[1] * 7152 + RGBA[2] * 722) / 10000;
    if(yiq >= 128) {
        return dark;
    }

    return light;
}

export default getContrastingColor;