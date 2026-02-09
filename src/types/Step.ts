import { RenderComponent } from "./RenderComponent.ts";
import { ToastMessages } from "../ui/alert/model/types/index.ts";
import { UseFormReturn } from "react-hook-form";
import { ReactNode } from "react";

export type UseStepFormResult = {
    steps: Steps,
    resultStep?: ResultStep
}

export type FormFields = {
    render: RenderComponent
    editToastMessages: ToastMessages
}

export type Step = {
    title: string
    fields: Array<string>
    render: RenderComponent
    editToastMessages?: ToastMessages
}

export type Steps = Array<Step>

export type ResultStep = {
    title: string
    render: (goTo: (index: number) => void) => ReactNode
}

export type StepProps<FieldValues extends Record<string, any> = any, TransformedFieldValues = FieldValues> = UseFormReturn<FieldValues, any, TransformedFieldValues>;