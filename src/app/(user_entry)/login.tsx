import React from "react";
import LoginScreen from "../../reactNodes/screens/LoginScreen";
import {KeyboardProvider} from "react-native-keyboard-controller";

const Page: React.FC = () => {
    return (
        <KeyboardProvider>
            <LoginScreen />
        </KeyboardProvider>
    )
}

export default Page;