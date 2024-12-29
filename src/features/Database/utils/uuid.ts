import * as Crypto from "expo-crypto";

export const getUUID = () => {
    return Crypto.randomUUID();
}