import { ColorValue } from "react-native";
import { hexToRgba, rgbaToArray } from "./hexToRgba";

//https://24ways.org/2010/calculating-color-contrast
const getContrastingColor = (inputColor: ColorValue, light: ColorValue, dark: ColorValue) => {
    const rgba = hexToRgba(inputColor as string, 1);

    const arrayRgba = rgbaToArray(rgba);

    const yiq = (arrayRgba[0] * 2126 + arrayRgba[1] * 7152 + arrayRgba[2] * 722) / 10000;
    if(yiq >= 128) {
        return dark;
    }

    return light;
}

export default getContrastingColor;