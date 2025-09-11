const colors = ["#FF0000", "#FE6767", "#FC8968", "#FDAC6A", "#FFCB6A", "#FDEE65", "#F1F768", "#E2FFD8", "#C8FEAC", "#9CFE67", "#87CA67"];

export const getColor = (level: number) => {
    return colors[level] || colors[0];
};
