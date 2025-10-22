import { RenderComponent } from "./RenderComponent.ts";
import { ToastMessages } from "../ui/alert/model/types/index.ts";
import { ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

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
    type: "result"
    render: (goTo?: (index: number) => void) => ReactNode | null
}

export type StepProps<FieldValues extends Record<string, any>> = UseFormReturn<FieldValues>;