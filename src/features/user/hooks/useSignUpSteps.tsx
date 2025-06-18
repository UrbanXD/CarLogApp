import { NameStep, PasswordStep, SignUpFirstStep} from "../components/forms/steps/index.ts";
import { StepProps, Steps } from "../../../types/index.ts";

export const useSignUpSteps = (
    control: StepProps["control"]
): Steps =>
    [
        {
            title: "",
            fields: ["email"],
            render: () =>
                <SignUpFirstStep
                    control={ control }
                />
        },
        {
            title: "Személyes adatok",
            fields: ["firstname", "lastname"],
            render: () =>
                <NameStep
                    control={ control }
                />
        },
        {
            title: "Jelszó",
            fields: ["password", "rpassword"],
            render: () =>
                <PasswordStep
                    control={ control }
                />
        }
    ]