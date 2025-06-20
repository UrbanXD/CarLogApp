import { RenderComponent } from "./RenderComponent.ts";
import { ToastMessages } from "../ui/alert/types/index.ts";
import { ReactNode } from "react";
import { Control, UseFormGetValues, UseFormResetField } from "react-hook-form";

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

export interface StepProps {
    control: Control<any>;
    resetField?: UseFormResetField<any | undefined>;
    getValues?: UseFormGetValues<any | undefined>;
}