import { memberParams } from "@/types/management.interface";

export const removeElementAtIndex = (arr: memberParams[], index: number) => {
    if (index < 0 || index >= arr.length) {
        console.error("Index out of bounds");
        return arr;
    }
    return arr.slice(0, index).concat(arr.slice(index + 1));
};
