import {Control} from "react-hook-form";
import EmailStep from "./EmailStep";
import NameStep from "./NameStep";
import PasswordStep from "./PasswordStep";

const useSignUpSteps = (
    control: Control<any>,
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
            />
    ]

export default useSignUpSteps;