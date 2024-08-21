import {CustomScrollViewProp} from "./CustomScrollView.prop";
import Animated, {useAnimatedScrollHandler, useSharedValue} from "react-native-reanimated";
import {ScrollViewProvider, useScrollView} from "../../reactNodes/providers/ScrollViewProvider";
import React from "react";

const CustomScrollView: React.FC<CustomScrollViewProp> = ({ children, paddingTop }) => {
    const { lastContentOffset, isScrolling} = useScrollView()

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            if (
                lastContentOffset.value > event.contentOffset.y &&
                isScrolling
            ) {
                // console.log("scrolling up");
            } else if (
                lastContentOffset.value < event.contentOffset.y &&
                isScrolling
            ) {
                // console.log("scrolling down");
            }

            lastContentOffset.value = event.contentOffset.y;
            // setLastContentOffset(event.contentOffset.y);
            // console.log(lastContentOffset.value)
        },
        onBeginDrag: (e) => {
            isScrolling.value = true
            // setIsScrolling(true);
        },
        onEndDrag: (e) => {
            isScrolling.value = false;
            // setIsScrolling(false);
        },
    });

    return (
        <Animated.ScrollView
            onScroll={ scrollHandler }
            style={{ paddingTop: paddingTop }}
            // scrollEventThrottle={ 400 }
        >
            { children }
        </Animated.ScrollView>
    )
}

export default CustomScrollView;