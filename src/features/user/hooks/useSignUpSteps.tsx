import { NameStep, PasswordStep, SignUpFirstStep } from "../components/forms/steps/index.ts";
import { Steps } from "../../../types/index.ts";
import { UseFormReturn } from "react-hook-form";
import { SignUpRequest } from "../schemas/form/signUpRequest.ts";
import { useTranslation } from "react-i18next";

export const useSignUpSteps = (form: UseFormReturn<SignUpRequest>): Steps => {
    const { t } = useTranslation();

    return [
        {
            title: "",
            fields: ["email"],
            render: () => <SignUpFirstStep { ...form } />
        },
        {
            title: t("auth.sign_up.steps.personal_information"),
            fields: ["firstname", "lastname"],
            render: () => <NameStep { ...form } />
        },
        {
            title: t("auth.sign_up.steps.password"),
            fields: ["password", "rpassword"],
            render: () => <PasswordStep { ...form } />
        }
    ];
};