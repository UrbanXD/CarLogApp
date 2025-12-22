import { z } from "zod";
import { ColorValue } from "react-native";
import dayjs from "dayjs";

export type ZodNumberErrorMessage = {
    required?: string
    minBound?: (min?: number) => string
    maxBound?: (max?: number) => string
}

type ZodNumberArgs = {
    optional?: boolean
    bounds?: { min?: number, max?: number },
    errorMessage?: ZodNumberErrorMessage
}

type ZodDateArgs = {
    optional?: boolean
    requiredErrorMessage?: string
} | null

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
            { message: errorMessage?.required ?? "error.number_required" }
        )
        .refine(
            (value) => bounds?.min !== undefined ? ((optional && value === null) || value >= bounds.min) : true,
            { message: errorMessage?.minBound?.(bounds?.min) ?? `error.number_min_limit;${ bounds?.min }` }
        )
        .refine(
            (value) => bounds?.max !== undefined ? ((optional && value === null) || value < bounds.max) : true,
            { message: errorMessage?.maxBound?.(bounds?.max) ?? `error.number_max_limit;${ bounds?.max }` }
        )
    );

    return optional ? base.optional().nullable() : base;
};

export const zPickerRequired = (errorMessage?: string = "error.picker_required") => z.preprocess(
    (value) => value ? value : "",
    z.union([
        z.string({ required_error: errorMessage }).min(1, errorMessage),
        z.number({ required_error: errorMessage })
    ])
);

export const zImage = z.object({
    fileName: z.string(),
    base64: z.string().base64(),
    mediaType: z.string().optional().nullable()
});

export type Image = z.infer<typeof zImage>;
// .refine(
//     files => [ 'image/jpg', 'image/jpeg', 'image/png' ].includes( files?.[ 0 ]?.type ),
//     'Accepted Formats: JPG/JPEG/PNG'
// )
// .refine( files => files?.[ 0 ]?.size <= 1 * 1024 * 1024, "Size shouldn't be more than 1 MB" )

export const zColor = z
.custom<ColorValue | null>(value => value === null || value instanceof ColorValue);

export const zDate = (args: ZodDateArgs = {}) => {
    const {
        optional = false,
        requiredErrorMessage = "error.date_required"
    } = args;
    const required_error = requiredErrorMessage;

    let schema = z.union([
        z.string({ required_error })
        .transform(v => {
            if(v === "" || v == null) return null;
            return dayjs(v).isValid() ? dayjs(v).toISOString() : null;
        }),
        z.date({ required_error }).transform(v => v.toISOString())
    ]);

    if(optional) {
        schema = schema
        .nullable()
        .optional()
        .transform(v => v ?? null);
    }

    return schema;
};

export const zNote = () => z
.string()
.nullable()
.transform((value) => value?.length > 0 ? value.toString() : null);