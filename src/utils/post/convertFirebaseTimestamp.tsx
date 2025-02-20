import { Timestamp } from "firebase/firestore";

export const convertFirebaseTimestamp = (date: Timestamp) => {
    const newDate = new Date(date.seconds * 1000 + date.nanoseconds / 1e6);
    return newDate;
};
