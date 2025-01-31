import React from "react";
import { Provider } from "react-redux";
import { store } from "../../features/Database/redux/store";
import HomeScreen from "../../screens/HomeScreen/components/HomeScreen";

const Page: React.FC = () => {
    return (
        <Provider store={ store }>
            <HomeScreen />
        </Provider>
    );
}

export default Page;