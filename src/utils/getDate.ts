export const getToday = () => {
    const today = new Date();
    return today;
}

export const getDate = () => {
    const today = getToday();

    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    // const day = today.getDay();
    const day = today.getDate();

    return `${ year }.${ addLeadingZero(month) }.${ addLeadingZero(day) }`;
}

export const addLeadingZero = (data: string | number, length: number = 2) => {
    return String(data).padStart(length, '0');
}