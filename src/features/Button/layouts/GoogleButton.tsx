import React from "react";
import TextButton from "../components/TextButton";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {theme} from "../../Shared/constants/theme";

interface GoogleButtonProps {
    onPress: () => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onPress }) =>
    <TextButton
        text="Folytatás Google fiókkal"
        fontSize={ hp(2.35) }
        textColor={ theme.colors.googleRed }
        backgroundColor={ theme.colors.white }
        iconLeft={ require("../../../assets/images/google_logo.png") }
        onPress={ onPress }
    />

export default GoogleButton;