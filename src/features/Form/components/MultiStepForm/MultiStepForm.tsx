import React from "react";
import { Control, UseFormResetField, UseFormTrigger } from "react-hook-form";
import { MultiStepFormProvider } from "../../context/MultiStepFormProvider";
import MultiStepFormProgressInfo from "./MultiStepFormProgressInfo";
import MultiStepFormContent from "./MultiStepFormContent";
import MultiStepFormButtons from "./MultiStepFormButtons";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants/index.ts";
import { FlatList } from "react-native-gesture-handler";
import { ResultStep, Steps } from "../../../../types/index.ts";


interface MultiStepFormProps {
    steps: Steps
    resultStep?: ResultStep
    isFirstCount?: boolean
    control: Control<any>
    submitHandler: () => Promise<void>
    trigger: UseFormTrigger<any>
    resetField?: UseFormResetField<any>
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
    const [contentVisibleAreaHeight, setContentVisibleAreaHeight] = React.useState<number | undefined>();

    const handleLayout = (event: LayoutChangeEvent) => {
        setContentVisibleAreaHeight(event.nativeEvent.layout.height);
    }

    return (
        <MultiStepFormProvider
            steps={ steps }
            resultStep={ resultStep }
            isFirstCount={ isFirstCount }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
            resetField={ resetField }
            contentVisibleAreaHeight={ contentVisibleAreaHeight }
        >
            <View style={ styles.container }>
                <MultiStepFormProgressInfo />
                <FlatList
                    data={ [] }
                    onLayout={ handleLayout }
                    renderItem={ () => <></> }
                    ListEmptyComponent={
                        <MultiStepFormContent />
                    }
                    showsVerticalScrollIndicator={ false }
                />
                <MultiStepFormButtons />
            </View>
        </MultiStepFormProvider>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: SEPARATOR_SIZES.lightSmall
    }
})

export default React.memo(MultiStepForm);