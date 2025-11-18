export function secondsToTimeText(seconds: number): string {
    if(seconds < 1) return "néhány másodperc";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    let text = "";

    if(days > 0) text += `${ days } nap`;

    if(hours > 0) {
        if(text) text += " ";
        text += `${ hours } óra`;
    }

    if(minutes > 0) {
        if(text) text += " ";
        text += `${ minutes } perc`;
    }

    return text || "néhány másodperc";
}