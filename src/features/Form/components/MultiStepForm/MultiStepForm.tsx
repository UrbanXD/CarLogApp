import React, {ReactNode} from "react";
import {Control, UseFormResetField, UseFormTrigger} from "react-hook-form";
import {MultiStepFormProvider} from "../../context/MultiStepFormProvider";
import MultiStepFormProgressInfo from "./MultiStepFormProgressInfo";
import MultiStepFormContent from "./MultiStepFormContent";
import MultiStepFormButtons from "./MultiStepFormButtons";
import {StyleSheet, View} from "react-native";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {SEPARATOR_SIZES} from "../../../Shared/constants/constants";

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
            <MultiStepFormContent />
            <MultiStepFormButtons isFirstCount={ isFirstCount } />
        </View>
    </MultiStepFormProvider>

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        height: "100%",
        width: wp(100),
        gap: SEPARATOR_SIZES.normal,
    }
})

export default MultiStepForm;