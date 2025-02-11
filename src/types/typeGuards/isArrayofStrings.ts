export const isStringArray = (members: any): members is string[] => {
    return (
        Array.isArray(members) &&
        members.every((member) => typeof member === "string")
    );
};
