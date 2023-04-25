import {
    RenderPageContext,
    SetPageContext,
    ViewType
} from "./Contexts";

import React, {
    useState
} from "react";

export const ViewTypeProvider: React.FC<any> = ({children}) => {
    const [currentView, setCurrentView] = useState<ViewType>('home');
    return (
        <RenderPageContext.Provider value={currentView}>
            <SetPageContext.Provider value={setCurrentView}>
                {children}
            </SetPageContext.Provider>
        </RenderPageContext.Provider>
    );
}