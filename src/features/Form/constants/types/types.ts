import { ReactNode } from "react";
import { Control, UseFormGetValues, UseFormResetField } from "react-hook-form";
import { ToastMessages } from "../../../Alert/constants/types.ts";

export type RenderComponent = () => ReactNode | null

export type Step = {
    title: string
    fields: Array<string>
    render: RenderComponent
    editToastMessages?: ToastMessages
}

export type ResultStep = {
    type: "result"
    render: (goTo?: (index: number) => void) => ReactNode | null
}

export type Steps = Array<Step>

export interface StepProps {
    control: Control<any>
    resetField?: UseFormResetField<any | undefined>
    getValues?: UseFormGetValues<any | undefined>
}