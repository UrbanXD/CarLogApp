import React from "react";
import { Provider } from "react-redux";
import CarProfileScreen from "../../screens/CarProfileScreen.tsx";
import { store } from "../../database/redux/store.ts";

const Page: React.FC = () => {
    return (
        <Provider store={ store }>
            <CarProfileScreen/>
        </Provider>
    );
};

export default Page;