import { OrderByDirectionExpression } from "kysely";

export * from "./Color";
export * from "./ImageSource";
export * from "./RenderComponent.ts";
export * from "./Step.ts";

export type Image = {
    path: string
    image: string
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

export type Paginator<T> = {
    search: {
        term?: string,
        fieldName: keyof T
    }
    pagination: Pagination<keyof T>
}