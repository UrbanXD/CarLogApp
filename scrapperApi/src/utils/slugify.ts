export const slugify = (text: string): string => {
    return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents (Škoda -> Skoda)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // all non char or number to "-"
    .replace(/(^-|-$)+/g, ""); // remove unnecessary "-"
};