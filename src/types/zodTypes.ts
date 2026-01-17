import { z } from "zod";
import dayjs from "dayjs";
import { isNaN } from "es-toolkit/compat";

export type ZodNumberErrorMessage = {
    required?: string
    minBound?: (min?: number) => string
    maxBound?: (max?: number) => string
}

type ZodDateArgs = {
    optional?: boolean
    requiredErrorMessage?: string
}

type ZodNumberArgs = {
    bounds?: { min?: number, max?: number },
    errorMessage?: ZodNumberErrorMessage
}

const zNumberBase = ({ bounds, errorMessage }: ZodNumberArgs) => z
.coerce
.number({ invalid_type_error: errorMessage?.required ?? "error.number_required" })
.superRefine((value, ctx) => {
    if(value === null || value === undefined) return;

    if(bounds?.min !== undefined && value < bounds.min) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errorMessage?.minBound?.(bounds.min) ?? `error.number_min_limit;${ bounds.min }`
        });
    }

    if(bounds?.max !== undefined && value >= bounds.max) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: errorMessage?.maxBound?.(bounds.max) ?? `error.number_max_limit;${ bounds.max }`
        });
    }
});

export const zNumberOptional = (args: ZodNumberArgs = {}) => zNumberBase(args)
.nullable()
.optional()
.or(z.literal(""))
.transform(v => (v === "" || v === null ? null : Number(v)));

export const zNumber = (args: ZodNumberArgs = {}) => zNumberBase(args)
.superRefine((value, ctx) => {
    if(value === null || value === undefined) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: args?.errorMessage?.required ?? "error.number_required"
        });
        return;
    }
});

type ZodPickerArgs = { errorMessage?: string }

export const zPickerRequiredString = (args?: ZodPickerArgs) => {
    const required_error = args?.errorMessage ?? "error.picker_required";

    return z
    .string({ required_error })
    .min(1, required_error)
    .nullable()
    .optional()
    .refine((value) => value, { message: required_error });
};

export const zPickerRequiredNumber = (args?: ZodPickerArgs) => {
    const required_error = args?.errorMessage ?? "error.picker_required";

    return z
    .preprocess(
        (val) => {
            if(typeof val === "string" && !isNaN(Number(val))) return Number(val);
            if(typeof val === "number") return val;

            return undefined;
        },
        z.number({ required_error })
    )
    .refine((val) => val !== undefined && val !== null && !isNaN(val), {
        message: required_error
    });
};

export const zImage = z.object({
    uri: z.string(),
    fileName: z.string(),
    mediaType: z.string().optional().nullable()
});

export type Image = z.infer<typeof zImage>;
// .refine(
//     files => [ 'image/jpg', 'image/jpeg', 'image/png' ].includes( files?.[ 0 ]?.type ),
//     'Accepted Formats: JPG/JPEG/PNG'
// )
// .refine( files => files?.[ 0 ]?.size <= 1 * 1024 * 1024, "Size shouldn't be more than 1 MB" )

export const zDate = (args?: ZodDateArgs) => {
    const optional = args?.optional ?? false;
    const required_error = args?.requiredErrorMessage ?? "error.date_required";

    let schema: z.ZodType<any, any, any> = z.union([
        z.string({ required_error })
        .transform(v => {
            if(v === "" || v == null) return null;
            return dayjs(v).isValid() ? dayjs(v).toISOString().replace("T", " ") : null;
        }),
        z.date({ required_error }).transform(v => v.toISOString().replace("T", " "))
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
.optional()
.transform((value) => value && value.length > 0 ? value.toString() : null);