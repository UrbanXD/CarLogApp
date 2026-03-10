import { useLocalSearchParams } from "expo-router";
import { ResetPasswordBottomSheet } from "../../features/user/presets/bottomSheet/index.ts";

function Page() {
    const { email } = useLocalSearchParams<{ email?: string }>();

    return (
        <ResetPasswordBottomSheet email={ email }/>
    );
}

export default Page;