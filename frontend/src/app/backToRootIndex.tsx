import React, { useEffect } from "react";
import { router } from "expo-router";

const Page: React.FC = () => {
    useEffect(() => {
        setTimeout(() => {
            router.replace("/");
        }, 0);
    }, []);

    return (
        <></>
    );
};

export default Page;