import React from "react";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "../../features/core/redux/store";
import { theme } from "../../features/core/constants/theme";
import HomeScreen from "../../features/layouts/screens/HomeScreen";

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