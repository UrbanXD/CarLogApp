import { ImageSourcePropType } from "react-native";

export const formatImageSource = (source: ImageSourcePropType | string) => {
    return (
        typeof source === "string"
            ? { uri: `data:image/jpeg;base64,${source}` }
            : source
    )
}