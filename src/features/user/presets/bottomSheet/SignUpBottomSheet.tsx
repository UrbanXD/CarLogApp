import React from "react";
import SignUpForm from "../../components/forms/SignUpForm.tsx";
import { useTranslation } from "react-i18next";
import { FormBottomSheet } from "../../../../ui/bottomSheet/presets/FormBottomSheet.tsx";

const SignUpBottomSheet: React.FC = () => {
    const { t } = useTranslation();

    const TITLE = t("auth.sign_up.title");
    const CONTENT = <SignUpForm/>;
    const SNAP_POINTS = ["62.5%"];

    return (
        <FormBottomSheet
            title={ TITLE }
            content={ CONTENT }
            snapPoints={ SNAP_POINTS }
        />
    );
};

export default SignUpBottomSheet;