import { Timestamp } from "firebase/firestore";

export const defaultPostValues = {
    id: "",
    titleENG: "",
    titlePL: "",
    introENG: "",
    introPL: "",
    descriptionENG: "",
    descriptionPL: "",
    mainFile: "",
    images: [],
    date: new Date(),
};
