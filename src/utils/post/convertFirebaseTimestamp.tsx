export const convertFirebaseTimestamp = (date: any) => {
    const newDate = new Date(date.seconds * 1000 + date.nanoseconds / 1e6);
    return newDate;
};
