import React from "react";
import { Control, UseFormResetField, UseFormTrigger } from "react-hook-form";
import { MultiStepFormProvider } from "../../contexts/multiStepForm/MultiStepFormProvider.tsx";
import MultiStepFormProgressInfo from "./MultiStepFormProgressInfo.tsx";
import MultiStepFormContent from "./MultiStepFormContent.tsx";
import MultiStepFormButtons from "./MultiStepFormButtons.tsx";
import { StyleSheet, View } from "react-native";
import { ResultStep, Steps } from "../../types/index.ts";
import { formTheme } from "../../ui/form/constants/theme.ts";


interface MultiStepFormProps {
    steps: Steps;
    resultStep?: ResultStep;
    isFirstCount?: boolean;
    control: Control<any>;
    submitHandler: () => Promise<void>;
    trigger: UseFormTrigger<any>;
    resetField?: UseFormResetField<any>;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
    steps,
    resultStep,
    isFirstCount = true,
    control,
    submitHandler,
    trigger,
    resetField
}) => {

    return (
        <MultiStepFormProvider
            steps={ steps }
            resultStep={ resultStep }
            isFirstCount={ isFirstCount }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
            resetField={ resetField }
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