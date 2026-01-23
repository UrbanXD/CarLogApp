import { useEffect, useState } from "react";

export function useDelayedBoolean(value: boolean, delay: number = 100) {
    const [delayedValue, setDelayedValue] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if(value) {
            timer = setTimeout(() => setDelayedValue(true), delay);
        } else {
            setDelayedValue(false);
        }

        return () => clearTimeout(timer);
    }, [value, delay]);

    return delayedValue;
}