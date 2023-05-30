import React from "react";

export type ViewType =
    "home" |
    "students" |
    "settings" |
    "timetables" |
    "tickets" |
    "catalog" |
    null;

export interface UserInfo {
    setName: (value: string) => void;
    setURL: (value: string) => void;
}

export const RenderPageContext = React.createContext<ViewType>(null);

export const SetPageContext = React
    .createContext<React.Dispatch<React.SetStateAction<ViewType>>>(() => undefined);

export const mainPageContext = React
    .createContext<React.Dispatch<React.SetStateAction<boolean>>>(() => null);

export const updateStudentsContext = React.createContext<boolean>(false);

export const UserDataContext = React.createContext<UserInfo | null>(null);
