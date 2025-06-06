import { ReactNode } from "react";
import { Control, UseFormResetField } from "react-hook-form";

export type RenderComponent = () => ReactNode | null

export type Step = {
    title: string
    fields: Array<string>
    render: RenderComponent
}

export type Steps = Array<Step>

export interface StepProps {
    control: Control<any>
    resetField?: UseFormResetField<any | undefined>
}