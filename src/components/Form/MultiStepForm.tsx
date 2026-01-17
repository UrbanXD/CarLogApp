import React, { useEffect } from "react";
import { FormState, UseFormReturn } from "react-hook-form";
import { MultiStepFormProvider } from "../../contexts/multiStepForm/MultiStepFormProvider.tsx";
import MultiStepFormProgressInfo from "./MultiStepFormProgressInfo.tsx";
import MultiStepFormContent from "./MultiStepFormContent.tsx";
import MultiStepFormButtons from "./MultiStepFormButtons.tsx";
import { StyleSheet, View } from "react-native";
import { ResultStep, Steps, SubmitHandlerArgs } from "../../types/index.ts";
import { formTheme } from "../../ui/form/constants/theme.ts";


type MultiStepFormProps = {
    form: UseFormReturn<any>
    steps: Steps
    submitHandler: SubmitHandlerArgs<any>
    resultStep?: ResultStep
    isFirstCount?: boolean
    onFormStateChange?: (formState: FormState<any>) => void
}

function MultiStepForm({
    form,
    steps,
    submitHandler,
    resultStep,
    isFirstCount = true,
    onFormStateChange
}: MultiStepFormProps) {
    useEffect(() => {
        if(onFormStateChange) onFormStateChange(form.formState);
    }, [form.formState]);

    return (
        <MultiStepFormProvider
            form={ form }
            steps={ steps }
            resultStep={ resultStep }
            isFirstCount={ isFirstCount }
            submitHandler={ submitHandler }
        >
            <View style={ styles.container }>
                <MultiStepFormProgressInfo/>
                <MultiStepFormContent/>
                <MultiStepFormButtons/>
            </View>
        </MultiStepFormProvider>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: formTheme.gap
    }
});

export default React.memo(MultiStepForm);