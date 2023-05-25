import React, { 
    useEffect,
    useRef,
    useState
} from "react";

import { User } from "firebase/auth";
import { auth, db } from '../Firebase';
import { collection, getDocs, query, where } from "firebase/firestore";
import { useForceUpdate } from "@chakra-ui/react";

interface Secretary {
    email: string,
    name: string,
    surname: string,
    year_resp: number
    img?: string
}

export const AuthContext = React.createContext<User | null>(null);
export const SecretaryContext = React.createContext<Secretary | null>(null);

const AuthProvider: React.FC<any> = ({children}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [secretary, setSecretary] = useState<Secretary | null>(null);

    const update = useForceUpdate();

    useEffect(() => {
        auth.onAuthStateChanged(setCurrentUser);
    }, []);

    useEffect(() => {
        if (currentUser === null) {
            return;
        }
        const q = query(collection(db, "/secretari"),
            where("email", "==", currentUser.email));

        getDocs(q).then(docs => docs.forEach(doc => {
            setSecretary(doc.data() as Secretary);
            update();
        }))
    }, [currentUser]);

    return (
        <AuthContext.Provider value={currentUser}>
            <SecretaryContext.Provider value={secretary}>
                {children}
            </SecretaryContext.Provider>
        </AuthContext.Provider>
    );
}

export default AuthProvider;