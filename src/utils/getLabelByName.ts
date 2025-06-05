export const getLabelByName = (name: string) => {
    const nameSplit = name.split(" ");
    let label = "";
    nameSplit.map(word => {
        if(word !== "") label += word[0]
    });
    return label;
}