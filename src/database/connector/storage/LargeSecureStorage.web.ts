/** Browser storage for Supabase auth sessions. */
class LargeSecureStore {
    async getItem(key: string) {
        return typeof localStorage === "undefined" ? null : localStorage.getItem(key);
    }

    async removeItem(key: string) {
        if(typeof localStorage !== "undefined") localStorage.removeItem(key);
    }

    async setItem(key: string, value: string) {
        if(typeof localStorage !== "undefined") localStorage.setItem(key, value);
    }
}

export default LargeSecureStore;
