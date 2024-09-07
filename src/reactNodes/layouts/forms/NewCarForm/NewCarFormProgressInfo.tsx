import React, {useEffect} from "react";
import {useMultiStepForm} from "../../../providers/MultiStepFormProvider";
import {useSharedValue, withTiming} from "react-native-reanimated";
import {useFont} from "@shopify/react-native-skia";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import ProgressInfo from "../../../../components/MultiStepForm/ProgressInfo";
import {registerStepsTitle} from "../../../../constants/formSchema/registerForm";
import {newCarFormStepsField, newCarFormStepsTitle} from "../../../../constants/formSchema/newCarForm";
import {GLOBAL_STYLE, SEPARATOR_SIZES} from "../../../../constants/constants";
import {View} from "react-native";
import {ProgressBackButton, ProgressNextButton} from "../../../../components/Button/Button";

export const NewCarFormProgressInfo: React.FC = () => {
    const {
        steps,
        stepsCount,
        currentStep,
        currentStepText,
        isFirstStep,
    } = useMultiStepForm();

    const end = useSharedValue(0);
    useEffect(() => {
        end.value = withTiming((currentStep - (steps.length !== stepsCount ? 0 : -1)) / stepsCount, { duration: 1500 });
    }, [currentStep]);

    const font = useFont(require("../../../../assets/fonts/Gilroy-Heavy.otf"), hp(3));
    if (!font) return <></>

    return (
        <>
            {
                <ProgressInfo
                    radius={ hp(6) }
                    strokeWidth={ hp(1.25) }
                    // radius={ hp(!isKeyboardOpen ? 8 : 5) }
                    // strokeWidth={ hp(!isKeyboardOpen ? 2 : 1.25) }
                    end={ end }
                    font={ font }
                    statusText={ `${ stepsCount } / ${ currentStepText }` }
                    stepTitle={ newCarFormStepsTitle[currentStep] }
                    stepSubtitle={ newCarFormStepsField[currentStep + 1] !== undefined ? `Következő: ${ newCarFormStepsTitle[currentStep + 1] }` : undefined }
                />
            }
        </>
    )
}

export const NewCarFormContent: React.FC = () => {
    const {
        steps,
        currentStep,
    } = useMultiStepForm();

    return (
        <View style={ [GLOBAL_STYLE.formContainer, { justifyContent: "flex-start" }] }>
            {
                steps.map((step, index) =>{
                    return (
                        <View key={index} style={{ display: currentStep === index ? 'flex' : 'none' }}>
                            { step() }
                        </View>
                    )
                }
                )
            }
        </View>
    )
}

export const NewCarFormButtons: React.FC = () => {
    const {
        isFirstStep,
        isLastStep,
        next,
        back
    } = useMultiStepForm();

    return (
        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: SEPARATOR_SIZES.small }}>
            <View>
            {
                !isFirstStep &&
                <ProgressBackButton onPress={ back } />
            }
            </View>
            <View>
                {
                    // !isFirstStep &&
                    <ProgressNextButton onPress={ next } isLastStep={ isLastStep } />
                }
            </View>
        </View>
    )
}