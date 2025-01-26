import {Control, UseFormResetField} from "react-hook-form";

export interface StepProps {
    control: Control<any>
    resetField?: UseFormResetField<any | undefined>
}