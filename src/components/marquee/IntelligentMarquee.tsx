import React, { useState } from "react";
import { LayoutChangeEvent, View } from "react-native";
import { Marquee, MarqueeProps } from "./Marquee.tsx";
import { MeasureElement } from "./helper/MeasureElement.tsx";


function IMarquee(props: MarqueeProps) {
    const [viewWidth, setViewWidth] = useState(0);
    const [childrenWidth, setChildrenWidth] = useState(0);

    const viewOnLayout = (event: LayoutChangeEvent) => setViewWidth(event.nativeEvent.layout.width);
    const childrenOnLayout = (width: number) => setChildrenWidth(width);

    return (
        <View style={ { width: "100%" } } onLayout={ viewOnLayout }>
            <View style={ [props.style, { position: "absolute" }] }>
                <MeasureElement children={ props.children } onLayout={ childrenOnLayout }/>
            </View>
            {
                childrenWidth <= viewWidth
                ? <View style={ props.style }>{ props.children }</View>
                : <Marquee children={ props.children } { ...props } />
            }
        </View>
    );
}

export const IntelligentMarquee = React.memo(IMarquee);