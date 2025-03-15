import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { BaseConfig } from "../constants/BaseConfig.ts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppSelector } from "./index.ts";
import { updateUser} from "../features/Database/redux/user/functions/updateUser.ts";
import { useDatabase } from "../features/Database/connector/Database.ts";
import { UserTableType } from "../features/Database/connector/powersync/AppSchema.ts";

export const useUser = () => {
    const database = useDatabase();
    const dispatch = useAppDispatch();

    const user = useAppSelector(state => state.user.user);
    const userAvatar = useAppSelector(state => state.user.userAvatar);
    const isUserLoading = useAppSelector(state => state.user.isLoading);
    const [notVerifiedUser, setNotVerifiedUser] = useState<User | null>(null);

    const setUser = (newUser: UserTableType | null) => {
        dispatch(updateUser({ database, newUser }));
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
        userAvatar,
        isUserLoading,
        notVerifiedUser,
        fetchNotVerifiedUser,
        updateNotVerifiedUser
    }
}