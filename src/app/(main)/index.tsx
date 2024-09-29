import React from "react";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { theme } from "../../constants/theme";
import HomeScreen from "../../reactNodes/screens/HomeScreen";

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