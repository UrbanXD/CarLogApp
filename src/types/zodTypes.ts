import { z } from "zod";
import { ColorValue } from "react-native";
import { Image } from "./index.ts";
import dayjs from "dayjs";

type ZodNumberArgs = {
    optional?: boolean
    bounds?: { min?: number, max?: number },
    errorMessage?: { required?: string, minBound?: (min?: number) => string, maxBound?: (max?: number) => string }
}

export const zNumber = ({
    optional = false,
    bounds,
    errorMessage
}: ZodNumberArgs) => {
    const base = z
    .preprocess(
        (value: any) => (value || value === "0" || value === 0) ? value.toString() : "",
        z
        .string()
        .transform((value) => (value === "" ? (optional ? null : NaN) : Number(value)))
        .refine(
            (value) => optional || !isNaN(value),
            { message: errorMessage?.required ?? "Kérem adjon meg egy számot." }
        )
        .refine(
            (value) => bounds?.min !== undefined ? ((optional && value === null) || value >= bounds.min) : true,
            { message: errorMessage?.minBound?.(bounds?.min) ?? `A számnak nagyobbnak vagy egyenlőnek kell lennie mint ${ bounds?.min }.` }
        )
        .refine(
            (value) => bounds?.max !== undefined ? ((optional && value === null) || value < bounds.max) : true,
            { message: errorMessage?.maxBound?.(bounds?.max) ?? `A számnak kisebbnek kell lennie mint ${ bounds?.max }.` }
        )
    );

    return optional ? base.optional().nullable() : base;
};

export const zPickerRequired = (errorMessage?: string = "Válasszon ki egy elemet!") => z.union([
    z.string({ required_error: errorMessage }).min(1, errorMessage),
    z.number({ required_error: errorMessage })
]);

export const zImage = z
.custom<Image | null>(value => value === null || value instanceof Image);
// .refine(
//     files => [ 'image/jpg', 'image/jpeg', 'image/png' ].includes( files?.[ 0 ]?.type ),
//     'Accepted Formats: JPG/JPEG/PNG'
// )
// .refine( files => files?.[ 0 ]?.size <= 1 * 1024 * 1024, "Size shouldn't be more than 1 MB" )

export const zColor = z
.custom<ColorValue | null>(value => value === null || value instanceof ColorValue);

export const zDate = (requiredErrorMessage?: string) => {
    const required_error = requiredErrorMessage ?? "Kérem válasszon ki egy dátumot!";
    return z.union([
        z.string({ required_error })
        .transform(v => dayjs(v).isValid() ? dayjs(v).toISOString() : null),
        z.date({ required_error })
        .transform(v => v.toISOString())
    ]);
};