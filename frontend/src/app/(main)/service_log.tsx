import React from "react";
import { Provider } from "react-redux";
import ServiceLogScreen from "../../screens/ServiceLogScreen";
import { store } from "../../database/redux/store.ts";

const Page: React.FC = () => {
    return (
        <Provider store={ store }>
            <ServiceLogScreen/>
        </Provider>
    );
};

export default Page;