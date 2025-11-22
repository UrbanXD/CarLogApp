import React from "react";
import SignUpForm from "../../components/forms/SignUpForm.tsx";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { useTranslation } from "react-i18next";

const SignUpBottomSheet: React.FC = () => {
    const { t } = useTranslation();

    const TITLE = t("auth.sign_up.title");
    const CONTENT = <SignUpForm/>;
    const SNAP_POINTS = ["62.5%"];

    return (
        <BottomSheet
            title={ TITLE }
            content={ CONTENT }
            snapPoints={ SNAP_POINTS }
            enableDynamicSizing={ false }
            enableOverDrag={ false }
            enableDismissOnClose={ false }
        />
    );
};

export default SignUpBottomSheet;