export const isStringArray = (members: string[]): members is string[] => {
    return (
        Array.isArray(members) &&
        members.every((member) => typeof member === "string")
    );
};
