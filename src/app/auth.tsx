import React from "react";
import AuthScreen from "../screens/AuthScreen.tsx";
import { useAuth } from "../contexts/auth/AuthContext.ts";
import { Redirect } from "expo-router";

const Page: React.FC = () => {
    const { authenticated } = useAuth();

    if(authenticated) return <Redirect href="/(main)"/>;

    return <AuthScreen/>;
};

export default Page;