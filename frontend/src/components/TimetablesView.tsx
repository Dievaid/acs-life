import {
    VStack,
    Text,
    HStack,
    Select,
    Button,
    useForceUpdate
} from "@chakra-ui/react";

import { Timetable } from "./timetable/Timetable";
import { useEffect, useRef, useState } from "react";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../Firebase";
import { TimetableForm } from "./timetable/TimetableForm";
import { Student } from "./StudentsView";

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

interface SubjectData {
    subject: string,
    year: number
}


export const TimetablesView: React.FC = () => {
    const [year, setYear] = useState<number>(0);
    const [day, setDay] = useState<number>(0);
    const [series, setSeries] = useState<string>("");

    const studentsQuery = query(collection(db, "studenti"));
    const [students, setStudents] = useState<Array<Student>>([]);

    const [timetables, setTimetables] = useState<Array<TimetableData>>([]);
    const timetablesQuery = query(collection(db, "orare"));
    const timetablesRef = useRef<Array<TimetableData>>([]);

    const [subjects, setSubjects] = useState<Array<SubjectData>>([]);
    const subjectsQuery = query(collection(db, "materii"));
    const subjectsRef = useRef<Array<SubjectData>>([]);

    const [classes, setClasses] = useState<Array<string>>([]);

    const yearRef = doc(db, "serii", year.toString());
    const [groups, setGroups] = useState<Array<string>>([]);

    const [nr, setNr] = useState<number>(0);
    const [disable, setDisable] = useState<boolean>(true);

    const fetchStudents = () => {
        let students: Array<Student> = [];
        getDocs(studentsQuery)
            .then(res => res.forEach(doc => {
                let data: Student = doc.data() as Student;
                students.push(data);
            }))
            .then(_ => setStudents(students));
    }

    useEffect(fetchStudents, []);

    useEffect(() => {
        if (year !== 0 && series !== "") {
            let filteredStudents: Array<string> = students
                .filter(s => s.currentYear === year && s.group === series)
                .map(s => s.class);
            let uniqueCLasses = new Set(filteredStudents);
            setClasses(Array.from(uniqueCLasses));
        }
    }, [year, series])

    // get serii
    useEffect(() => {
        if (year !== 0) {
            getDoc(yearRef).then(doc => {
                if (doc.exists()) {
                    setGroups(doc.data().groups as Array<string>)
                }
            });
        }

    }, [year]);

    // get subjects
    useEffect(() => {
        let fetchedSubjects: Array<SubjectData> = [];
        getDocs(subjectsQuery)
            .then(
                docs => {
                    docs.forEach(
                        doc => {
                            let subject = doc.data() as SubjectData;
                            fetchedSubjects.push(subject);
                        }
                    )
                }
            )
            .then(_ => subjectsRef.current = [...fetchedSubjects]);
    }, []);

    // filter subjects
    useEffect(() => {
        if (year !== 0) {
            setSubjects(subjectsRef.current.filter(s => s.year === year));
        }
    }, [year])

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
            // .then(_ => setTimetables(fetchedTimetables))
            .then(_ => timetablesRef.current = [...fetchedTimetables]);
    }, []);

    useEffect(() => {
        if (year === 0 || series === "" || day === 0) {
            setTimetables([]);
            setDisable(true);
            return;
        }
        setDisable(false);
        setTimetables(timetablesRef.current.filter(t => t.year === year
            && t.group === series
            && t.day === day));
        
    }, [year, series, day, nr]);

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
        return Array.from({ length: 6 }, (_, i) => 8 + (i * 2)).map((h,idx) =>
            <Timetable
                key={`timetables${idx}`}
                startHour={h}
                data={timetables.filter(t => t.startHour === h).sort((t1, t2) => +t1.class - +t2.class)}
                deleteState = {false}
                setNr={setNr}
                timetablesRef={timetablesRef}
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
                    bg='#D3D3D3'
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
                    bg='#D3D3D3'
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
                <TimetableForm
                    year={year}
                    group={series}
                    day={day}
                    subjects={subjects.map(s => s.subject)}
                    classes={classes}
                    isDisabled={disable} 
                    setTimeTables={setTimetables}
                    timetables={timetables}
                    timetablesRef={timetablesRef}
                    setNr={setNr}
                    />
                <Button
                    isDisabled={disable}
                    colorScheme="blue"
                    width={"15%"}
                >Modificare</Button>
                <Button
                    isDisabled={disable}
                    colorScheme="red"
                    width={"15%"}
                >Stergere</Button>
            </HStack>
            {renderTimetables()}
        </VStack>
    );
}