import { hexToRgba, rgbaToArray } from "./hexToRgba";
import { Color } from "../../types/index.ts";

//https://24ways.org/2010/calculating-color-contrast
const getContrastingColor = (inputColor: Color, light: Color, dark: Color) => {
    try {
        const rgba = hexToRgba(inputColor as string, 1);

        const arrayRgba = rgbaToArray(rgba);

        const yiq = (arrayRgba[0] * 2126 + arrayRgba[1] * 7152 + arrayRgba[2] * 722) / 10000;
        if(yiq >= 128) {
            return dark;
        }

        return light;
    } catch(e: any) {
        return light;
    }
};

export default getContrastingColor;