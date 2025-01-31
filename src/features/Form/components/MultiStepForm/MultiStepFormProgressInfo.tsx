import React, { useEffect } from "react";
import { useMultiStepForm } from "../../context/MultiStepFormProvider";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useFont } from "@shopify/react-native-skia";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import ProgressInfo from "../../../../components/ProgressInfo";
import {StyleSheet, View} from "react-native";
import {SEPARATOR_SIZES} from "../../../../constants/constants";

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

    const font = useFont(require("../../../../assets/fonts/Gilroy-Heavy.otf"), hp(3));
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

export default MultiStepFormProgressInfo;