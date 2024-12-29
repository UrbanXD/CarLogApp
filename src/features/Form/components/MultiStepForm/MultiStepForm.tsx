import React, {ReactNode} from "react";
import {Control, UseFormResetField, UseFormTrigger} from "react-hook-form";
import {MultiStepFormProvider} from "../../context/MultiStepFormProvider";
import MultiStepFormProgressInfo from "./MultiStepFormProgressInfo";
import MultiStepFormContent from "./MultiStepFormContent";
import MultiStepFormButtons from "./MultiStepFormButtons";

interface MultiStepFormProps {
    steps: Array<() => ReactNode | null>
    stepsTitle: Array<string>
    fieldsName: Array<Array<string>>
    isFirstCount?: boolean
    control: Control<any>
    submitHandler:  (e?: (React.BaseSyntheticEvent<object, any, any> | undefined)) => Promise<void>
    trigger: UseFormTrigger<any>
    resetField?: UseFormResetField<any>
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
    steps,
    stepsTitle,
    fieldsName,
    isFirstCount = true,
    control,
    submitHandler,
    trigger,
    resetField
}) =>
    <MultiStepFormProvider
        steps={ steps }
        fieldsName={ fieldsName }
        isFirstCount={ isFirstCount }
        control={ control }
        submitHandler={ submitHandler }
        trigger={ trigger }
        resetField={ resetField }
    >
        <MultiStepFormProgressInfo
            isFirstCount={ isFirstCount }
            stepsTitle={ stepsTitle }
        />
        <MultiStepFormContent />
        <MultiStepFormButtons isFirstCount={ isFirstCount } />
    </MultiStepFormProvider>

export default MultiStepForm;