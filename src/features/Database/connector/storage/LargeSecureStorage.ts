import { deleteItemAsync, getItemAsync, setItemAsync, setItem, getItem } from 'expo-secure-store';
import { getRandomValues } from "expo-crypto";

class LargeSecureStore {
    private async _encrypt(key: string, value: string) {
        const encryptionKey = getRandomValues(new Uint8Array(256 / 8))
        const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1))
        const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value))

        await setItemAsync(key, aesjs.utils.hex.fromBytes(encryptionKey))

        return aesjs.utils.hex.fromBytes(encryptedBytes)
    }

    private async _decrypt(key: string, value: string) {
        const encryptionKeyHex = await getItemAsync(key)
        if (!encryptionKeyHex) {
            return encryptionKeyHex
        }

        const cipher = new aesjs.ModeOfOperation.ctr(
            aesjs.utils.hex.toBytes(encryptionKeyHex),
            new aesjs.Counter(1)
        )
        const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value))

        return aesjs.utils.utf8.fromBytes(decryptedBytes)
    }

    async getItem(key: string) {
        const encrypted = await getItem(key)
        if (!encrypted) {
            return encrypted
        }

        return await this._decrypt(key, encrypted)
    }

    async removeItem(key: string) {
        await removeItem(key)
        await deleteItemAsync(key)
    }

    async setItem(key: string, value: string) {
        const encrypted = await this._encrypt(key, value)

        await setItem(key, encrypted)
    }
}

export default LargeSecureStore;