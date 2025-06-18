import React from "react";
import { Provider } from "react-redux";
import EditCarScreen from "../../screens/EditCarScreen";
import { store } from "../../database/redux/store.ts";

const Page: React.FC = () => {
    return (
        <Provider store={ store }>
            <EditCarScreen />
        </Provider>
    )
}

export default Page;