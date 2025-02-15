import { OpenBottomSheetArgs } from "../context/BottomSheetContext.ts";
import VerifyOTP, { HandleVerificationOtpType } from "../../Auth/components/VerifyOTP.tsx";

type DeleteUserVerificationBottomSheetType = (
    email: string,
    handleVerification: HandleVerificationOtpType
) => OpenBottomSheetArgs;

export const DeleteUserVerificationBottomSheet: DeleteUserVerificationBottomSheetType = (
    email,
    handleVerification
) => {
    return {
        snapPoints: ["100%"],
        content:
            <VerifyOTP
                type="magiclink"
                title="Fiók törlése"
                email={ email }
                handleVerification={ handleVerification }
            />
    }
}