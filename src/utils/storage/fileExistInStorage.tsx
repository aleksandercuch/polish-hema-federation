import { ref, deleteObject, getMetadata } from "firebase/storage";
import { storage } from "../../../firebase/config/clientApp";

export const fileExists = async (filePath: string) => {
    try {
        await getMetadata(ref(storage, filePath));
        return true;
    } catch (error) {
        console.warn(`File not found: ${filePath}`);
        return false;
    }
};
