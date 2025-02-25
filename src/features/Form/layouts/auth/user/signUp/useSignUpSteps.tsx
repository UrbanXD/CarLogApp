import { Control } from "react-hook-form";
import { NameStep, PasswordStep, SignUpFirstStep} from "../steps";

export const useSignUpSteps = (
    control: Control<any>
) =>
    [
        () =>
            <SignUpFirstStep
                control={ control }
            />,
        () =>
            <NameStep
                control={ control }
            />,
        () =>
            <PasswordStep
                control={ control }
            />
    ]