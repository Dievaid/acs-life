import { UserDataContext } from "./Contexts";

export const UserDataProvider: React.FC<React.PropsWithChildren<any>> = ({children, userRef}) => {    
    
    return (
        <UserDataContext.Provider value={userRef.current}>
            {children}
        </UserDataContext.Provider>
    );
}