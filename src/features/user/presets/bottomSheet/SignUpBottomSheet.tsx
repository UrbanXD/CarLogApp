import React from "react";
import SignUpForm from "../../components/forms/SignUpForm.tsx";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";

const SignUpBottomSheet: React.FC = () => {
    const TITLE = "Regisztráció";
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