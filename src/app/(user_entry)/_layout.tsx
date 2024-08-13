import {Tabs} from 'expo-router';
import React from "react";
import {Provider} from "react-redux";
import {store} from "../../redux/store";
import {theme} from "../../constants/theme";
import {PaperProvider} from "react-native-paper";

const TabLayout:React.FC = () => {
    return (
        <Provider store={ store }>
            <PaperProvider theme={ theme }>
                <Tabs tabBar={(props) => {
                    return <></>;
                }} initialRouteName={"register"} backBehavior="history">
                    <Tabs.Screen
                        name="register"
                        options={{
                            title: "Register",
                            headerShown: false
                        }}
                    />
                    <Tabs.Screen
                        name="login"
                        options={{
                            title: "Login",
                            headerShown: false,
                        }}
                    />
                </Tabs>
            </PaperProvider>
        </Provider>
    );
}
export default TabLayout;