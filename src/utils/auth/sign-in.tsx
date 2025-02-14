// API
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../../firebase/config/clientApp";

export const SignIn = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential);
        })
        .catch((error) => {
            console.log(error);
        });
};
