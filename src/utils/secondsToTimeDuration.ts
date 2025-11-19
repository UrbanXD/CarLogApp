export function secondsToTimeText(seconds: number, showsSeconds?: boolean = false): string {
    if(!showsSeconds && seconds < 59) return "néhány másodperc";

    let remaining = seconds;

    const days = Math.floor(remaining / 86400);
    remaining %= 86400;

    const hours = Math.floor(remaining / 3600);
    remaining %= 3600;

    const minutes = Math.floor(remaining / 60);
    remaining %= 60;

    const remainingSeconds = remaining;

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

    if(showsSeconds && remainingSeconds > 0) {
        if(text) text += " ";
        text += `${ remainingSeconds } másodperc`;
    }

    return text || "néhány másodperc";
}