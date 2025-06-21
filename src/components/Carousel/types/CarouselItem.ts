import { ImageSource } from "../../../types/index.ts";

export type CarouselItem = {
    id: string
    image: ImageSource
    title?: string
    subtitle?: string
    body?: string
    selected?: boolean
}