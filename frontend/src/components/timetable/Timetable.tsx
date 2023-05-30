import React from "react";

import { TimetableData } from "../TimetablesView";
import { Center, HStack } from "@chakra-ui/react";
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase";

interface TimetableProps {
    startHour: number,
    data: Array<TimetableData>,
    timetablesRef: React.MutableRefObject<TimetableData[]>,
    setNr: React.Dispatch<React.SetStateAction<number>>,
    deleteState: boolean
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
                onClick={() => {
                    if (!props.deleteState) return;
                    props.timetablesRef.current = props.timetablesRef.current.filter(tt => tt !== t);
                    const timetablesQuery = query(collection(db, "orare"),
                        where("class", "==", t.class),
                        where("day", "==", t.day),
                        where("group", "==", t.group),
                        where("startHour", "==", t.startHour),
                        where("year", "==", t.year),
                        where("subject", "==", t.subject),
                        where("type", "==", t.type)
                    );
                    getDocs(timetablesQuery).then(docs => docs.forEach(async doc => {
                        await deleteDoc(doc.ref);
                    }));
                    props.setNr((prev) => prev - 1);
                }}
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