import React from "react";

interface ComponentsProps<P>{
    Component: React.FC<P>
    props?: P
}

interface CompactorProps {
    components: Array<ComponentsProps<any>>
    children?: React.ReactNode

}

const Compactor: React.FC<CompactorProps> = ({
    components = [],
    children
}) =>
    <>
        {
            components.reduceRight(
                (children, { Component, props }) =>
                    <Component { ...props }>
                        { children }
                    </Component>
            , children)
        }
    </>

export default Compactor;