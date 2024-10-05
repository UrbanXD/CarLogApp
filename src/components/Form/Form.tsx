import React, { ReactNode, useEffect } from "react";
import { GLOBAL_STYLE, SEPARATOR_SIZES } from "../../constants/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { MultiStepFormProvider, useMultiStepForm } from "../../reactNodes/providers/MultiStepFormProvider";
import { Control, UseFormResetField, UseFormTrigger } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { ProgressBackButton, ProgressNextButton } from "../Button/Button";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useFont } from "@shopify/react-native-skia";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import ProgressInfo from "../MultiStepForm/ProgressInfo";

interface FormProps {
    children: ReactNode | null
}

export const Form: React.FC<FormProps> = ({ children }) => {
    return (
        <KeyboardAwareScrollView
            bounces={ false }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={ false }
            contentContainerStyle={ [GLOBAL_STYLE.scrollViewContentContainer, { paddingTop: SEPARATOR_SIZES.extraMedium }] }
        >
            <View style={ [GLOBAL_STYLE.formContainer, { justifyContent: "flex-start" }] }>
                { children }
            </View>
        </KeyboardAwareScrollView>
    )
}

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
}) => {

    return (
        <MultiStepFormProvider
            steps={ steps }
            fieldsName={ fieldsName }
            isFirstCount={ isFirstCount }
            control={ control }
            submitHandler={ submitHandler }
            trigger={ trigger }
            resetField={ resetField }
        >
            <KeyboardAwareScrollView
                bounces={ false }
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={ [GLOBAL_STYLE.scrollViewContentContainer, { paddingTop: SEPARATOR_SIZES.extraMedium }] }
            >
                <MultiStepFormProgressInfo
                    isFirstCount={ isFirstCount }
                    stepsTitle={ stepsTitle }
                />
                <MultiStepFormContent />
            </KeyboardAwareScrollView>
            <MultiStepFormButtons isFirstCount={ isFirstCount } />
        </MultiStepFormProvider>
    )
}

interface MultiStepFormProgressInfoProps {
    isFirstCount: boolean
    stepsTitle: Array<string>
}

const MultiStepFormProgressInfo: React.FC<MultiStepFormProgressInfoProps> = ({
    isFirstCount,
    stepsTitle
}) => {
    const {
        steps,
        stepsCount,
        currentStep,
        currentStepText,
        isFirstStep,
    } = useMultiStepForm();

    const end = useSharedValue(0);
    useEffect(() => {
        end.value = withTiming((currentStep + (steps.length === stepsCount ? 1 : 0)) / stepsCount, { duration: 1500 });
    }, [currentStep]);

    const font = useFont(require("../../assets/fonts/Gilroy-Heavy.otf"), hp(3));
    if (!font) return <></>;

    return (
        <>
            {
                (isFirstCount && isFirstStep || !isFirstStep) &&
                <ProgressInfo
                    radius={ hp(6) }
                    strokeWidth={ hp(1.25) }
                    end={ end }
                    font={ font }
                    statusText={ `${ stepsCount } / ${ currentStepText }` }
                    stepTitle={ stepsTitle[currentStep] }
                    stepSubtitle={ stepsTitle[currentStep + 1] !== undefined ? `Következik: ${ stepsTitle[currentStep + 1] }` : undefined }
                />
            }
        </>
    )
}

interface MultiStepFormButtonsProps {
    isFirstCount: boolean
}

const MultiStepFormButtons: React.FC<MultiStepFormButtonsProps> = ({ isFirstCount }) => {
    const {
        isFirstStep,
        isLastStep,
        next,
        back
    } = useMultiStepForm();

    return (
        <View style={ styles.buttonsContainer }>
            <View style={{ flex: 0.175 }}>
                {
                    !isFirstStep &&
                    <ProgressBackButton onPress={ back } />
                }
            </View>
            <View style={{ flex: 0.825 }}>
                {
                    ((isFirstCount && isFirstStep) || !isFirstStep) &&
                    <ProgressNextButton
                        onPress={ next }
                        isLastStep={ isLastStep }
                    />
                }
            </View>
        </View>
    )
}

const MultiStepFormContent: React.FC = () => {
    const {
        steps,
        currentStep,
    } = useMultiStepForm();

    const memoizedSteps = React.useMemo(() => steps.map(step => step), [steps]);

    return (
        <Form>
            { steps[currentStep]() }
        </Form>
    )
}

const styles = StyleSheet.create({
    buttonsContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: SEPARATOR_SIZES.small,
        alignItems: "center",
        gap: SEPARATOR_SIZES.small
    }
});