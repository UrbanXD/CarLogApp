import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { BaseConfig } from "../constants/BaseConfig.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserState } from "../features/Database/redux/user/user.slices.ts";
import { useAppSelector } from "./index.ts";
import { store } from "../features/Database/redux/store.ts";
import { updateUser} from "../features/Database/redux/user/functions/updateUser.ts";
import { useDatabase } from "../features/Database/connector/Database.ts";

export const useUser = () => {
    const database = useDatabase();

    const user = useAppSelector(state => state.user.user) as UserState["user"];
    const isUserLoading = useAppSelector(state => state.user.isLoading) as UserState["isLoading"];
    const [notVerifiedUser, setNotVerifiedUser] = useState<User | null>(null);

    const setUser = (newUser: UserState["user"]) => {
        store.dispatch(updateUser({ database, newUser }));
    }

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
        setUser,
        isUserLoading,
        notVerifiedUser,
        fetchNotVerifiedUser,
        updateNotVerifiedUser
    }
}