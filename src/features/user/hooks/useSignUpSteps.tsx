import { NameStep, PasswordStep, SignUpFirstStep } from "../components/forms/steps/index.ts";
import { Steps } from "../../../types/index.ts";
import { UseFormReturn } from "react-hook-form";
import { SignUpRequest } from "../schemas/form/signUpRequest.ts";

export const useSignUpSteps = (form: UseFormReturn<SignUpRequest>): Steps =>
    [
        {
            title: "",
            fields: ["email"],
            render: () => <SignUpFirstStep { ...form } />
        },
        {
            title: "Személyes adatok",
            fields: ["firstname", "lastname"],
            render: () => <NameStep { ...form } />
        },
        {
            title: "Jelszó",
            fields: ["password", "rpassword"],
            render: () => <PasswordStep { ...form } />
        }
    ];