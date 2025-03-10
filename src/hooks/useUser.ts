import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { BaseConfig } from "../constants/BaseConfig.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserState } from "../features/Database/redux/user/user.slices.ts";
import { useAppSelector } from "./index.ts";

export const useUser = () => {
    const user = useAppSelector(state => state.user.user) as UserState["user"];
    const isUserLoading = useAppSelector(state => state.user.isLoading) as UserState["isLoading"];
    const [notVerifiedUser, setNotVerifiedUser] = useState<User | null>(null);

    const fetchNotVerifiedUser = async () => {
        const newNotVerifiedUser = await AsyncStorage.getItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER)
        if(!newNotVerifiedUser) return;

        setNotVerifiedUser(JSON.parse(newNotVerifiedUser));
    }

    const updateNotVerifiedUser = async (newNotVerifiedUser: User | null) => {
        setNotVerifiedUser(newNotVerifiedUser);

        if(newNotVerifiedUser) {
            void AsyncStorage.setItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER, JSON.stringify(newNotVerifiedUser));
        } else {
            void AsyncStorage.removeItem(BaseConfig.LOCAL_STORAGE_KEY_NOT_VERIFIED_USER);
        }
    }

    return {
        user,
        isUserLoading,
        notVerifiedUser,
        fetchNotVerifiedUser,
        updateNotVerifiedUser
    }
}