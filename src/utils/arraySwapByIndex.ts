export function arraySwapByIndex<T>(array: Array<T>, i: number, j: number): Array<T> {
    const newArray = [...array];
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];

    return newArray;
}