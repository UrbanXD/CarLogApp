import React from "react";
import SignInForm from "../../components/forms/SignInForm.tsx";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";

const SignInBottomSheet: React.FC = () => {
    const TITLE = "Bejelentkezés";
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