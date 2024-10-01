import React, { useEffect } from "react";
import { useMultiStepForm } from "../../../providers/MultiStepFormProvider";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useFont } from "@shopify/react-native-skia";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import ProgressInfo from "../../../../components/MultiStepForm/ProgressInfo";
import { newCarFormStepsField, newCarFormStepsTitle } from "../../../../constants/formSchema/newCarForm";

const NewCarFormProgressInfo: React.FC = () => {
    const {
        steps,
        stepsCount,
        currentStep,
        currentStepText,
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

export default NewCarFormProgressInfo;