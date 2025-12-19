import React from "react";
import SignInForm from "../../components/forms/SignInForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

const SignInBottomSheet: React.FC = () => {
    const { t } = useTranslation();

    return (
        <FormBottomSheet
            title={ t("auth.sign_in") }
            content={ <SignInForm/> }
            enableDynamicSizing
        />
    );
};

export default SignInBottomSheet;