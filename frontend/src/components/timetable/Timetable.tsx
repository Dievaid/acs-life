import React from "react";

import { TimetableData } from "../TimetablesView";
import { Center, HStack } from "@chakra-ui/react";

interface TimetableProps {
    startHour: number,
    data: Array<TimetableData>
}

export const Timetable: React.FC<TimetableProps> = (props) => {

    const timetablesByStartHour = props.data.filter(el => el.startHour === props.startHour);

    const renderClasses = () => {
        return timetablesByStartHour.map((t, idx) =>
            <Center
                key={`class${idx}`}
                height={"100%"}
                bg="#89CFF0"
                rounded={"md"}
                flex={"1"}
                textAlign={"center"}
            >
                {t.subject + "(" + t.type + ")" + " " + t.class}
            </Center>
        )
    }

    return (
        //@ts-ignore
        <HStack
            width={"90%"}
            height={"40px"}
            justifyContent={"space-evenly"}
        >
            <Center
                bg="#A9A9A9"
                height={"100%"}
                rounded={"md"}
                width={"10%"}
                textAlign={"center"}
            >
                {props.startHour + ":00 - " + (props.startHour + 2) + ":00"}
            </Center>
            {renderClasses()}
        </HStack>
    );
};