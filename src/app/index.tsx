import React from "react";
import { Redirect } from "expo-router";
import FirstScreen from "../features/Screens/components/FirstScreen";
import { useAuth } from "../features/Auth/context/AuthProvider";

const App: React.FC = () => {
    const { session } = useAuth();

    return (
        !(session && session.user)
            ?   <FirstScreen />
            :   <Redirect href="/(main)" />
    )
}

export default App;