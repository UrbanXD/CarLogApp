import React, { ReactNode } from "react";
import { Control, UseFormResetField, UseFormTrigger } from "react-hook-form";
import { MultiStepFormProvider } from "../../context/MultiStepFormProvider";
import MultiStepFormProgressInfo from "./MultiStepFormProgressInfo";
import MultiStepFormContent from "./MultiStepFormContent";
import MultiStepFormButtons from "./MultiStepFormButtons";
import { StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants/constants";
import { FlatList } from "react-native-gesture-handler";

interface MultiStepFormProps {
    steps: Array<() => ReactNode | null>
    stepsTitle: Array<string>
    fieldsName: Array<Array<string>>
    isFirstCount?: boolean
    control: Control<any>
    submitHandler: () => Promise<void>
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
        <View style={ styles.container }>
            <MultiStepFormProgressInfo
                isFirstCount={ isFirstCount }
                stepsTitle={ stepsTitle }
            />
            <FlatList
                data={ [] }
                renderItem={ () => <></> }
                ListEmptyComponent={
                    <MultiStepFormContent />
                }
                showsVerticalScrollIndicator={ false }
            />
            <MultiStepFormButtons isFirstCount={ isFirstCount } />
        </View>
    </MultiStepFormProvider>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: SEPARATOR_SIZES.normal,
    }
})

export default MultiStepForm;