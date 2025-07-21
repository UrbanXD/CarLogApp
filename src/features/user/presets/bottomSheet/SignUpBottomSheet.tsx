import React from "react";
import SignUpForm from "../../components/forms/SignUpForm.tsx";
import BottomSheet from "../../../../ui/bottomSheet/components/BottomSheet.tsx";
import { heightPercentageToDP } from "react-native-responsive-screen";

const SignUpBottomSheet: React.FC = () => {
    const TITLE = "Felhasználó létrehozás";
    const CONTENT = <SignUpForm/>;
    const MAX_DYNAMIC_CONTENT_SIZE = heightPercentageToDP(85);

    return (
        <BottomSheet
            title={ TITLE }
            content={ CONTENT }
            enableDynamicSizing
            maxDynamicContentSize={ MAX_DYNAMIC_CONTENT_SIZE }
            enableOverDrag={ false }
            enableDismissOnClose={ false }
        />
    );
};

export default SignUpBottomSheet;