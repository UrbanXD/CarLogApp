import { ReactNode } from "react";
import {Control, UseFormGetValues, UseFormResetField} from "react-hook-form";

export type RenderComponent = () => ReactNode | null

export type Step = {
    title: string
    fields: Array<string>
    render: RenderComponent
}

export type ResultStep = {
    type: "result"
    render: (goTo?: (index: number) => void) => ReactNode | null
}

export type Steps = Array<Step | ResultStep>

export interface StepProps {
    control: Control<any>
    resetField?: UseFormResetField<any | undefined>
    getValues?: UseFormGetValues<any | undefined>
}