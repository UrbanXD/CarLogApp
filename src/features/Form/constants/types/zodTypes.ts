import {z} from "zod";

export const zNumber = z
    .preprocess(
    (value: any) => value.toString(),
        z
        .string()
        .min(1, "Adjon meg számot")
        .transform((value) => (value === "" ? "" : Number(value)))
        .refine(
        (value) =>
                !isNaN(Number(value)),
        { message: "Kérem számot adjon",}
        )
    );

export const zPickerRequired = z
    .string()
    .min(1, "Válasszon ki egy elemet!");

export const zImage = z
    .any()
    // .refine(value => (value === "" ? "" : Number(value)))

