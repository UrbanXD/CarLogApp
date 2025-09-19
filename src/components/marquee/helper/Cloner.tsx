import React, { ReactNode } from "react";
import { AnimatedChild } from "./AnimatedChild.tsx";

type ClonerProps = {
    children: ReactNode
    times?: number
} & Omit<AnimatedChild, "children" | "index">

export function Cloner({ children, times = 2, ...animateChildProps }: ClonerProps) {
    if(times <= 0) return <></>;

    return (
        [...Array(times).keys()].map((index) => (
            <AnimatedChild
                key={ `clone-${ index }` }
                index={ index }
                { ...animateChildProps }
            >
                { children }
            </AnimatedChild>
        ))
    );
}