import i18n from "../i18n/index.ts";

export function secondsToTimeText(seconds: number, showsSeconds: boolean = false): string {
    if(!showsSeconds && seconds < 59) return i18n.t("date.few_seconds");

    let remaining = seconds;

    const days = Math.floor(remaining / 86400);
    remaining %= 86400;

    const hours = Math.floor(remaining / 3600);
    remaining %= 3600;

    const minutes = Math.floor(remaining / 60);
    remaining %= 60;

    const remainingSeconds = remaining;

    let text = "";

    if(days > 0) text += i18n.t("date.days", { value: days });

    if(hours > 0) {
        if(text) text += " ";
        text += i18n.t("date.hours", { value: hours });
    }

    if(minutes > 0) {
        if(text) text += " ";
        text += i18n.t("date.minutes", { value: minutes });
    }

    if(showsSeconds && remainingSeconds > 0) {
        if(text) text += " ";
        text += i18n.t("date.seconds", { value: remainingSeconds });
    }

    return text ?? i18n.t("date.few_seconds");
}