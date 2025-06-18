import { z } from "zod";
import {ImageType} from "../utils/pickImage.ts";
import {ColorValue} from "react-native";
import {valueOf} from "react-native-url-polyfill";

export const zNumber = z
    .preprocess(
    (value: any) => value ? value.toString() : "",
        z
        .string()
        .transform(
            (value) =>
                (value === "" ? NaN : Number(value))
        )
        .refine(
            (value) => !isNaN(value),
            { message: "Kérem adjon meg egy számot." }
        )
        .refine(
            (value) => value > 0,
            { message: "A számnak nullától nagyobbnak kell lennie." }
        )
    )

export const zPickerRequired = z
    .string()
    .min(1, "Válasszon ki egy elemet!");

export const zImage = z
    .custom<ImageType | null>(value => value === null || value instanceof ImageType)
    // .refine(
    //     files => [ 'image/jpg', 'image/jpeg', 'image/png' ].includes( files?.[ 0 ]?.type ),
    //     'Accepted Formats: JPG/JPEG/PNG'
    // )
    // .refine( files => files?.[ 0 ]?.size <= 1 * 1024 * 1024, "Size shouldn't be more than 1 MB" )

export const zColor = z
    .custom<ColorValue | null>(value => value === null || value instanceof ColorValue)
