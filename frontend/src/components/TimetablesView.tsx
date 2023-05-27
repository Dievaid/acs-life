import {
    VStack,
    Text,
    HStack,
    Select,
    Button
} from "@chakra-ui/react";

import { Timetable } from "./timetable/Timetable";
import { useEffect, useRef, useState } from "react";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../Firebase";

export type CourseType = "course" | "lab" | "seminar";

export interface TimetableData {
    class: string,
    day: number,
    group: string,
    startHour: number,
    subject: string,
    type: CourseType,
    year: number
}


export const TimetablesView: React.FC = () => {
    const [year, setYear] = useState<number>(0);
    const [day, setDay] = useState<number>(0);
    const [series, setSeries] = useState<string>("");

    const [timetables, setTimetables] = useState<Array<TimetableData>>([]);
    const timetablesQuery = query(collection(db, "orare"));
    const timetablesRef = useRef<Array<TimetableData>>([]);

    const yearRef = doc(db, "serii", year.toString());
    const [groups, setGroups] = useState<Array<string>>([]);

    useEffect(() => {
        if (year !== 0) {
            getDoc(yearRef).then(doc => {
                if (doc.exists()) {
                    setGroups(doc.data().groups as Array<string>)
                }
            })
        }

    }, [year]);

    // get data from server
    useEffect(() => {
        let fetchedTimetables: Array<TimetableData> = [];
        getDocs(timetablesQuery)
            .then(docs => {
                docs.forEach(
                    doc => {
                        let timetable = doc.data() as TimetableData;
                        fetchedTimetables.push(timetable);
                    }
                )
            })
            .then(_ => setTimetables(fetchedTimetables))
            .then(_ => timetablesRef.current = [...fetchedTimetables]);
    }, []);

    useEffect(() => {
        if (year === 0 || series === "" || day === 0) {
            setTimetables([]);
            return;
        }
        setTimetables(timetablesRef.current.filter(t => t.year === year
            && t.group === series
            && t.day === day));
    }, [year, series, day]);

    const renderGroups = () => {
        return groups.map((g, idx) =>
            <option
                key={`group${idx}`}
                value={g}
            >
                {"Seria " + g}
            </option>);
    }

    const renderTimetables = () => {
        return timetables.map((t, idx) =>
            <Timetable
                key={`timetable${idx}`}
                startHour={t.startHour}
                data={timetables}
            />
        );
    }
    useEffect(() => {
        console.log("year: " + year + "\n");
    }, [year]);
    useEffect(() => {
        console.log("day: " + day + "\n");
    }, [day]);
    useEffect(() => {
        console.log("series: " + series + "\n");
    }, [series]);

    return (
        // @ts-ignore
        <VStack
            spacing={7}
        >
            <Text>Timetables pageee</Text>
            <HStack
                width={"100%"}
                justifyContent={"space-evenly"}
            >
                <Select
                    placeholder='Selectati anul'
                    width={"25%"}
                    bg='#A9A9A9'
                    onChange={(e) => {
                        e.preventDefault();
                        setYear(+e.target.value);
                    }}
                >
                    <option value={1} >ANUL I</option>
                    <option value={2}>ANUL II</option>
                    <option value={3}>ANUL III</option>
                    <option value={4}>ANUL IV</option>
                </Select>
                <Select
                    placeholder='Selectati seria'
                    isDisabled={year === 0}
                    width={"25%"}
                    bg='#C0C0C0'
                    onChange={(e) => {
                        e.preventDefault();
                        setSeries(e.target.value)
                    }}
                >
                    {renderGroups()}
                </Select>
                <Select
                    placeholder='Selectati ziua'
                    isDisabled={series === ""}
                    width={"25%"}
                    bg='#D3D3D3'
                    onChange={(e) => {
                        e.preventDefault();
                        setDay(+e.target.value);
                    }}
                >
                    <option value={1}>Luni</option>
                    <option value={2}>Marti</option>
                    <option value={3}>Miercuri</option>
                    <option value={4}>Joi</option>
                    <option value={5}>Vineri</option>
                </Select>
            </HStack>
            <HStack
                width={"100%"}
                justifyContent={"space-evenly"}
            >
                <Button
                    colorScheme="green"
                    width={"15%"}
                >Adaugare</Button>
                <Button
                    colorScheme="blue"
                    width={"15%"}
                >Modificare</Button>
                <Button
                    colorScheme="red"
                    width={"15%"}
                >Stergere</Button>
            </HStack>
            {renderTimetables()}
        </VStack>
    );
}