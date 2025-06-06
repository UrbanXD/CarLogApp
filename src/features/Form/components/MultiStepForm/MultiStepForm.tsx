import React, { ReactNode } from "react";
import { Control, UseFormResetField, UseFormTrigger } from "react-hook-form";
import { MultiStepFormProvider } from "../../context/MultiStepFormProvider";
import MultiStepFormProgressInfo from "./MultiStepFormProgressInfo";
import MultiStepFormContent from "./MultiStepFormContent";
import MultiStepFormButtons from "./MultiStepFormButtons";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { SEPARATOR_SIZES } from "../../../../constants/constants";
import { FlatList } from "react-native-gesture-handler";
import { Steps } from "../../constants/types/types.ts";

interface MultiStepFormProps {
    steps: Steps
    isFirstCount?: boolean
    control: Control<any>
    submitHandler: () => Promise<void>
    trigger: UseFormTrigger<any>
    resetField?: UseFormResetField<any>
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
    steps,
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
                    onLayout={ handleLayout }
                    data={ [] }
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
        gap: SEPARATOR_SIZES.normal,
    }
})

export default MultiStepForm;