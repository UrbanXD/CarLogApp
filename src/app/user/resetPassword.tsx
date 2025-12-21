import { useLocalSearchParams } from "expo-router";
import { ResetPasswordBottomSheet } from "../../features/user/presets/bottomSheet/index.ts";

function Page() {
    const { email } = useLocalSearchParams();

    return (
        <ResetPasswordBottomSheet email={ email }/>
    );
}

export default Page;