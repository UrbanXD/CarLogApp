import React from "react";
import { store } from "../../features/Database/redux/store";
import { Provider } from "react-redux";
import ServiceLogScreen from "../../features/Screens/components/ServiceLogScreen";
import EditCarScreen from "../../features/Screens/EditCar/components/EditCarScreen";

const Page: React.FC = () => {
    return (
        <Provider store={ store }>
            <EditCarScreen />
        </Provider>
    )
}

export default Page;