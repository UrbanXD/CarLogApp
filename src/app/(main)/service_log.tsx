import React from "react";
import { store } from "../../features/core/redux/store";
import { PaperProvider } from "react-native-paper";
import { theme } from "../../features/core/constants/theme";
import { Provider } from "react-redux";
import ServiceLogScreen from "../../features/layouts/screens/ServiceLogScreen";

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