import * as ImagePicker from "expo-image-picker";

export const askMediaLibraryPermission = async (failureMessage: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "denied"){
        alert(failureMessage);
    }
}

export const askCameraPermission = async (failureMessage: string) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status === "denied"){
        alert(failureMessage);
    }
}