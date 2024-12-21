import React from "react";
import { Provider } from "react-redux";
import { store } from "../../features/core/redux/store";
import HomeScreen from "../../features/layouts/screens/HomeScreen";

const Page: React.FC = () => {
    return (
        <Provider store={ store }>
            <HomeScreen />
        </Provider>
    );
}

export default Page;