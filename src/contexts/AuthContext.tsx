"use client";
// CORE
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

// API
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    UserCredential,
    User,
} from "firebase/auth";
import auth from "../../firebase/config/clientApp";

interface CreateContextProps {
    createUser: (email: string, password: string) => Promise<UserCredential>;
    signIn: (email: string, password: string) => Promise<UserCredential>;
    user: User | null;
    logout: () => Promise<void>;
}

interface AuthContextProviderProps {
    children: ReactNode;
}

const UserContext = createContext<CreateContextProps | null>(null);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const createUser = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const signIn = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        setUser(null);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider
            value={{
                createUser,
                signIn,
                user,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(UserContext);
};
