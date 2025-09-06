import { z } from "zod";
import { ColorValue } from "react-native";
import { Image } from "./index.ts";

export const zNumber = (defaultValue?: number = NaN, minValue?: number = 0) => z
.preprocess(
    (value: any) => value ? value.toString() : defaultValue.toString(),
    z
    .string()
    .transform((value) => (Number(value)))
    .refine(
        (value) => !isNaN(value),
        { message: "Kérem adjon meg egy számot." }
    )
    .refine(
        (value) => value >= minValue,
        { message: `A számnak nagyobbnak vagy egyenlőnek kell lennie mint ${ minValue }.` }
    )
);

export const zPickerRequired = z
.string()
.min(1, "Válasszon ki egy elemet!");

export const zImage = z
.custom<Image | null>(value => value === null || value instanceof Image);
// .refine(
//     files => [ 'image/jpg', 'image/jpeg', 'image/png' ].includes( files?.[ 0 ]?.type ),
//     'Accepted Formats: JPG/JPEG/PNG'
// )
// .refine( files => files?.[ 0 ]?.size <= 1 * 1024 * 1024, "Size shouldn't be more than 1 MB" )

export const zColor = z
.custom<ColorValue | null>(value => value === null || value instanceof ColorValue);
