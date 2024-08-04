// import React, {createContext, ReactNode, useEffect, useState} from "react";
//
// interface AuthProviderValue {
//     username: string | null;
//     login: (username: string) => Promise<void>;
//     logout: () => Promise<void>;
//     isReady: boolean;
// }
// const AuthContext = createContext<AuthProviderValue | null>(null);
//
// interface AuthProviderProps {
//     children: ReactNode | null
// }
//
// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//     const [isReady, setIsReady] = useState(false);
//     const [username, setUsername] = useState<string | null>(null);
//
//     useEffect(() => {
//         load();
//     }, []);
//
//     const load = async () => {
//
//         // We use WMDB's localStorage instead of AsyncStorage
//         const username = await database.localStorage.get<string>('username');
//         setUsername(username ?? null);
//         setIsReady(true);
//     };
//
//     const login = (username: string) => {
//         setUsername(username);
//         const db = getDb();
//         return db.localStorage.set('username', username);
//     };
//     const logout = () => {
//         setUsername(null);
//
//         const db = getDb();
//         // Once logout is done, we reset the database to blank state
//         // to avoid leaving data on the device for the next user
//         return db.write(() => {
//             return db.unsafeResetDatabase();
//         });
//     };
//
//     return (
//         <AuthContext.Provider value={{ username, login, logout, isReady }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }