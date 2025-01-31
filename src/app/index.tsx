import React from "react";
import { Redirect } from "expo-router";
import AuthScreen from "../screens/AuthScreen";
import { useAuth } from "../features/Auth/context/AuthProvider";

const App: React.FC = () => {
    const { session } = useAuth();

    return (
        !(session && session.user)
            ?   <AuthScreen />
            :   <Redirect href="/(main)" />
    )
}

export default App;