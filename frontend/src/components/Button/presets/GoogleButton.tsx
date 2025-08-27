import React from "react";
import TextButton from "../TextButton";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { COLORS } from "../../../constants/index.ts";
import { useGoogleAuth } from "../../../features/user/hooks/useGoogleAuth.ts";

export const GoogleButton: React.FC = () => {
    const { googleAuth } = useGoogleAuth();

    return (
        <TextButton
            text="Folytatás Google fiókkal"
            fontSize={ hp(2.35) }
            textColor={ COLORS.googleRed }
            backgroundColor={ COLORS.white }
            iconLeft={ require("../../../assets/images/google_logo.png") }
            loadingIndicator
            onPress={ googleAuth }
        />
    );
};