import { z } from "zod";
import { ColorValue } from "react-native";
import { Image } from "./index.ts";

export const zNumber = (
    bounds?: { min?: number, max?: number },
    errorMessage?: { required?: string, minBound?: (min?: number) => string, maxBound?: (max?: number) => string }
) => z
.preprocess(
    (value: any) => value ? value.toString() : "",
    z
    .string()
    .transform((value) => (value === "" ? NaN : Number(value)))
    .refine(
        (value) => !isNaN(value),
        { message: errorMessage?.required ?? "Kérem adjon meg egy számot." }
    )
    .refine(
        (value) => bounds?.min ? value >= bounds.min : true,
        { message: errorMessage?.minBound?.(bounds?.min) ?? `A számnak nagyobbnak vagy egyenlőnek kell lennie mint ${ bounds?.min }.` }
    )
    .refine(
        (value) => bounds?.max ? value < bounds.max : true,
        { message: errorMessage?.maxBound?.(bounds?.max) ?? `A számnak kisebbnek kell lennie mint ${ bounds?.max }.` }
    )
);

export const zPickerRequired = (errorMessage?: string = "Válasszon ki egy elemet!") => z
.string()
.min(1, errorMessage);

export const zImage = z
.custom<Image | null>(value => value === null || value instanceof Image);
// .refine(
//     files => [ 'image/jpg', 'image/jpeg', 'image/png' ].includes( files?.[ 0 ]?.type ),
//     'Accepted Formats: JPG/JPEG/PNG'
// )
// .refine( files => files?.[ 0 ]?.size <= 1 * 1024 * 1024, "Size shouldn't be more than 1 MB" )

export const zColor = z
.custom<ColorValue | null>(value => value === null || value instanceof ColorValue);
