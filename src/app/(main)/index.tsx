import React, {useEffect, useState} from "react";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { theme } from "../../constants/theme";
import HomeScreen from "../../screens/HomeScreen";
import FirstScreen from "../../screens/FirstScreen";
import {StatusBar} from "react-native";

const Page: React.FC = () => {
    return (
        <Provider store={ store }>
            <PaperProvider theme={ theme }>
                <HomeScreen />
            </PaperProvider>
        </Provider>
    );
}

export default Page;