import { RawDraftContentState } from "react-draft-wysiwyg";
import { Timestamp } from "firebase/firestore";

export type PostT = {
    id: string;
    titleENG: string;
    titlePL: string;
    introENG: string;
    introPL: string;
    descriptionENG: string | RawDraftContentState;
    descriptionPL: string | RawDraftContentState;
    mainFile: string | File;
    date: Timestamp;
    images: File[] | string[];
};
