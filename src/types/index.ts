import { OrderByDirectionExpression } from "kysely";
import { SubmitErrorHandler, SubmitHandler } from "react-hook-form";

export * from "./Color";
export * from "./ImageSource";
export * from "./RenderComponent.ts";
export * from "./Step.ts";

export type SubmitHandlerArgs<FormResult> = {
    onValid: SubmitHandler<FormResult>,
    onInvalid?: SubmitErrorHandler<FormResult>
}

export type OffsetPagination = {
    page: number,
    cursor?: never
}

export type CursorPagination<F> = {
    page?: never
    cursor: {
        value?: string | number
        fieldName: F,
        direction?: "prev" | "next"
    }
}

export type CommonPagination<F> = {
    perPage?: number,
    order?: {
        by: F,
        direction?: OrderByDirectionExpression
    }
}

export type Pagination<F = string> = (OffsetPagination | CursorPagination<F>) & CommonPagination<F>