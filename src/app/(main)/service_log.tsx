import React from "react";
import { store } from "../../redux/store";
import { PaperProvider } from "react-native-paper";
import { theme } from "../../constants/theme";
import { Provider } from "react-redux";
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