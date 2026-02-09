import { useWatchedQueryItem } from "../../../database/hooks/useWatchedQueryItem.ts";
import { useDatabase } from "../../../contexts/database/DatabaseContext.ts";
import { useAuth } from "../../../contexts/auth/AuthContext.ts";
import { useMemo } from "react";

export function useUser() {
    const { userDao } = useDatabase();
    const { sessionUserId } = useAuth();

    const userQuery = useMemo(() => {
        return userDao.userWatchedQueryItem(sessionUserId);
    }, [userDao, sessionUserId]);

    const { data, isLoading } = useWatchedQueryItem(userQuery);

    return { user: data, isLoading };
}