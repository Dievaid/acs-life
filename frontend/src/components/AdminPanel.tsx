import { useContext, useEffect, useState } from "react";
import { RenderPageContext, ViewType } from "./Contexts";
import { HomeView } from "./HomeView";
import { SettingsView } from "./SettingsView";
import SidebarWithHeader from "./SidebarWithHeader";
import { StudentsView } from "./StudentsView";
import { TicketsView } from "./TicketsView";
import { TimetablesView } from "./TimetablesView";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { User } from "firebase/auth";
import { CatalogView } from "./CatalogView";

const AdminPanel: React.FC = () => {
    const generateSelectedSection = (view: ViewType) => {
        switch (view) {
            case "home":
                return <HomeView />
            case "settings":
                return <SettingsView />
            case "students":
                return <StudentsView />
            case "tickets":
                return <TicketsView />
            case "timetables":
                return <TimetablesView />
            case "catalog":
                return <CatalogView />
        }
        return <></>;
    }

    const view = useContext<ViewType>(RenderPageContext);

    const [selectedView, setSelectedView] = useState<JSX.Element>(<></>);

    const navigate: NavigateFunction = useNavigate();
    const user: User | null = useContext(AuthContext);

    useEffect(() => {
        if (user === null) {
            navigate("/");
        }
    });

    useEffect(() => {
        setSelectedView(generateSelectedSection(view));
    }, [view]);

    return (
        <SidebarWithHeader>
            {selectedView}
        </SidebarWithHeader>
    );
}

export default AdminPanel;