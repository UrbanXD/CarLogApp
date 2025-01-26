import React from "react";
import { store } from "../../features/Database/redux/store";
import { Provider } from "react-redux";
import ServiceLogScreen from "../../features/Screens/components/ServiceLogScreen";

const Page: React.FC = () => {
    return (
        <Provider store={ store }>
            <ServiceLogScreen />
        </Provider>
    )
}

export default Page;