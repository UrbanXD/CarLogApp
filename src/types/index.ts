export * from "./Color";
export * from "./ImageSource";
export * from "./RenderComponent.ts";
export * from "./Step.ts";

export type Image = {
    path: string
    image: string
}

export type Paginator = {
    searchTerm?: string,
    pagination: {
        page: number,
        perPage?: number
    }
}