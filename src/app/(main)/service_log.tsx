import React from "react";
import {Text, View} from "react-native";
import {store} from "../../redux/store";
import {PaperProvider} from "react-native-paper";
import {theme} from "../../constants/theme";
import HomeScreen from "../../reactNodes/screens/HomeScreen";
import {Provider} from "react-redux";
import ServiceLogScreen from "../../reactNodes/screens/ServiceLogScreen";

const Page: React.FC = () => {
    return (
        <Provider store={ store }>
            <PaperProvider theme={ theme }>
                <ServiceLogScreen />
            </PaperProvider>
        </Provider>
    )
}

export default Page;