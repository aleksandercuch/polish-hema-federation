export const addRandomSuffix = (input: string): string => {
    const randomNumbers = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 10)
    ).join("");
    return `${input}-${randomNumbers}`;
};
