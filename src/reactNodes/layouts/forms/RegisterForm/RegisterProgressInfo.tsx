import React, {useEffect} from "react";
import {View} from "react-native";
import ProgressInfo from "../../../../components/MultiStepForm/ProgressInfo";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {registerStepsTitle} from "../../../../constants/formSchema/registerForm";
import {useMultiStepForm} from "../../../providers/MultiStepFormProvider";
import {SEPARATOR_SIZES} from "../../../../constants/constants";
import {useFont} from "@shopify/react-native-skia";
import {useSharedValue, withTiming} from "react-native-reanimated";

const RegisterProgressInfo: React.FC = () => {
    const {
        steps,
        stepsCount,
        currentStep,
        isFirstStep,
    } = useMultiStepForm();

    const end = useSharedValue(0);
    useEffect(() => {
        end.value = withTiming((currentStep - (steps.length !== stepsCount ? 0 : 1)) / stepsCount, { duration: 1500 });
    }, [currentStep]);

    const font = useFont(require("../../../../assets/fonts/Gilroy-Heavy.otf"), hp(3));
    if (!font) return <></>

    return (
        <>
            {
                !isFirstStep &&
                    <ProgressInfo
                        radius={ hp(6) }
                        strokeWidth={ hp(1.25) }
                        // radius={ hp(!isKeyboardOpen ? 8 : 5) }
                        // strokeWidth={ hp(!isKeyboardOpen ? 2 : 1.25) }
                        end={ end }
                        font={ font }
                        statusText={ `${ stepsCount } / ${ currentStep }` }
                        stepTitle={ registerStepsTitle[currentStep] }
                        stepSubtitle={ registerStepsTitle[currentStep + 1] !== undefined ? `Következő: ${ registerStepsTitle[currentStep + 1] }` : undefined }
                    />
            }
        </>
    )
}

export default RegisterProgressInfo;