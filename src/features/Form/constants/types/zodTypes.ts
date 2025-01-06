import { z } from "zod";

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
    .any()
    // .refine(value => (value === "" ? "" : Number(value)))

