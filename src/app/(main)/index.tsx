import React from "react";
import { Provider } from "react-redux";
import { store } from "../../features/Database/redux/store";
import HomeScreen from "../../features/Screens/components/HomeScreen";

const Page: React.FC = () => {
    return (
        <Provider store={ store }>
            <HomeScreen />
        </Provider>
    );
}

export default Page;