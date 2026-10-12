import { Platform, useWindowDimensions } from "react-native";

export const DESKTOP_WEB_BREAKPOINT = 1040;

export function useDesktopWeb() {
    const { width } = useWindowDimensions();
    return Platform.OS === "web" && width >= DESKTOP_WEB_BREAKPOINT;
}
