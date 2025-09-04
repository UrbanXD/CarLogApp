import React from "react";
import AuthScreen from "../screens/AuthScreen.tsx";
import { Redirect } from "expo-router";
import { useAuthNew } from "../features/auth/contexts/AuthContext.ts";

const Page: React.FC = () => {
    const { authenticated } = useAuthNew();

    if(authenticated) return <Redirect href="/(main)"/>;

    return (
        <AuthScreen/>
    );
};

export default Page;