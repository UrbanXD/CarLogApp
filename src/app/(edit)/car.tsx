import React from "react";
import { store } from "../../features/Database/redux/store";
import { Provider } from "react-redux";
import ServiceLogScreen from "../../screens/ServiceLogScreen";
import EditCarScreen from "../../screens/EditCarScreen";

const Page: React.FC = () => {
    return (
        <Provider store={ store }>
            <EditCarScreen />
        </Provider>
    )
}

export default Page;