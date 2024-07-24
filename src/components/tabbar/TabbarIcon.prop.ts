export interface TabbarIconProp {
    title?: string
    textColor: string
    focused: boolean
    focusedColor?: string
    iconName?: string
    iconColor?: string,
    iconSize?: number,
    onPress: () => void
    onLongPress: () => void,
    width: number
}