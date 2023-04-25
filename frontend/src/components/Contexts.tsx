import React from "react";

export type ViewType =
    "home" |
    "students" |
    "settings" |
    "timetables" |
    "tickets" |
    null;

export const RenderPageContext = React.createContext<ViewType>(null);

export const SetPageContext = React
    .createContext<React.Dispatch<React.SetStateAction<ViewType>>>(() => undefined);

export const mainPageContext = React
    .createContext<React.Dispatch<React.SetStateAction<boolean>>>(() => null);
