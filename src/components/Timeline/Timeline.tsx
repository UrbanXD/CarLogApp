import React, {ReactNode} from "react";

interface TimelineProps {
    data: Array<any>
    renderItem: () => ReactNode
}

const Timeline: React.FC<TimelineProps> = ({ data, renderItem }) => {
    return (
        <></>
    )
}

export default Timeline;