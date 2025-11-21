import React, { useEffect } from "react";
import { useMultiStepForm } from "../../contexts/multiStepForm/MultiStepFormContext.ts";
import { useSharedValue, withTiming } from "react-native-reanimated";
import { useFont } from "@shopify/react-native-skia";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import ProgressInfo from "../ProgressInfo.tsx";
import { useTranslation } from "react-i18next";

const MultiStepFormProgressInfo: React.FC = () => {
    const { t } = useTranslation();
    const {
        steps,
        currentStep,
        currentStepText,
        realStepsCount,
        isFirstCount,
        isLastCount,
        isFirstStep,
        isLastStep
    } = useMultiStepForm();

    const end = useSharedValue(0);
    useEffect(() => {
        if(isLastStep && !isLastCount) return;

        end.value = withTiming(Number(currentStepText) / realStepsCount, { duration: 1500 });
    }, [currentStep]);

    const font = useFont(require("../../assets/fonts/Gilroy-Heavy.otf"), hp(3));
    if(!font) return <></>;

    const showsProgressInfo = ((!isFirstStep && !isLastStep) || (isFirstStep && isFirstCount) || (isLastStep && isLastCount));

    return (
        <>
            {
                showsProgressInfo &&
               <ProgressInfo
                  radius={ hp(6) }
                  strokeWidth={ hp(1.25) }
                  end={ end }
                  font={ font }
                  statusText={ `${ realStepsCount } / ${ currentStepText }` }
                  stepTitle={ t(steps[currentStep]?.title ?? "common.unknown") }
                  stepSubtitle={
                      steps[currentStep + 1]?.title !== undefined
                      ? t("multistep_form.next_step", { step: t(steps[currentStep + 1].title) })
                      : undefined
                  }
               />
            }
        </>
    );
};

export default MultiStepFormProgressInfo;