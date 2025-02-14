import { memberParams } from "../management.interface";

export const isMemberParams = (
    member: memberParams
): member is memberParams => {
    return (
        typeof member === "object" &&
        member !== null &&
        "id" in member &&
        "name" in member &&
        "descriptionENG" in member &&
        "descriptionPL" in member &&
        "file" in member
    );
};
