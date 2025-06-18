import { Control } from "react-hook-form";
import { EmailStep, NameStep, PasswordStep } from "../components/forms/steps/index.ts";
import {AvatarStep} from "../components/forms/steps/AvatarStep.tsx";

export enum EDIT_USER_FORM_STEPS {
    EmailStep,
    NameStep,
    PasswordStep,
    AvatarStep
}

export const useEditUserSteps = (
    control: Control<any>
) =>
    [
        () =>
            <EmailStep
                control={ control }
            />,
        () =>
            <NameStep
                control={ control }
            />,
        () =>
            <PasswordStep
                control={ control }
            />,
        () =>
            <AvatarStep
                control={ control }
            />
    ]