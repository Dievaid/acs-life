import React, { 
    useEffect,
    useState
} from "react";

import { User } from "firebase/auth";
import { auth } from '../Firebase';

export const AuthContext = React.createContext<User | null>(null);

const AuthProvider: React.FC<any> = ({children}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        auth.onAuthStateChanged(setCurrentUser);
    }, [currentUser]);

    return (
        <AuthContext.Provider
            value={currentUser}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;