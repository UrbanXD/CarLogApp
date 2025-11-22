import React from "react";
import SignInForm from "../../components/forms/SignInForm.tsx";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { useTranslation } from "react-i18next";

const SignInBottomSheet: React.FC = () => {
    const { t } = useTranslation();
    const TITLE = t("auth.sign_in");
    const CONTENT = <SignInForm/>;

    return (
        <BottomSheet
            title={ TITLE }
            content={ CONTENT }
            enableDynamicSizing
            enableOverDrag={ false }
            enableDismissOnClose={ false }
        />
    );
};

export default SignInBottomSheet;