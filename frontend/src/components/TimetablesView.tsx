import {
    VStack,
    Text,
    HStack,
    Select,
    Button,
    useForceUpdate,
    useBoolean
} from "@chakra-ui/react";

import { Timetable } from "./timetable/Timetable";
import { useContext, useEffect, useRef, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { TimetableForm } from "./timetable/TimetableForm";
import { Student } from "./StudentsView";
import { SecretaryContext } from "./AuthProvider";
import { GenericAlert } from "./GenericAlert";

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
    const secretary = useContext(SecretaryContext);
    const [day, setDay] = useState<number>(0);
    const [series, setSeries] = useState<string>("");

    const [students, setStudents] = useState<Array<Student>>([]);

    const [timetables, setTimetables] = useState<Array<TimetableData>>([]);
    const timetablesRef = useRef<Array<TimetableData>>([]);

    const [subjects, setSubjects] = useState<Array<SubjectData>>([]);
    const subjectsRef = useRef<Array<SubjectData>>([]);

    const [classes, setClasses] = useState<Array<string>>([]);

    const [groups, setGroups] = useState<Array<string>>([]);

    const [nr, setNr] = useState<number>(0);
    const [disable, setDisable] = useState<boolean>(true);

    const [year, setYear] = useState<number>(0);

    useEffect(() => {
        if (secretary) {
            setYear(secretary.year_resp);
        }
    }, [secretary]);

    const fetchStudents = () => {
        const studentsQuery = query(collection(db, "studenti"));
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
        const yearRef = doc(db, "serii", year.toString());
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
        const subjectsQuery = query(collection(db, "materii"));
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
    }, [year]);

    // filter subjects
    useEffect(() => {
        if (year !== 0) {
            setSubjects(subjectsRef.current.filter(s => s.year === year));
        }
    }, [year])

    // get data from server
    useEffect(() => {
        let fetchedTimetables: Array<TimetableData> = [];
        const timetablesQuery = query(collection(db, "orare"));
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

    const [deleteState, setDeleteState] = useBoolean();
    const [alert, setAlert] = useBoolean();

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
                deleteState={deleteState}
                setNr={setNr}
                timetablesRef={timetablesRef}
            />
        );
    }

    return (
        // @ts-ignore
        <VStack
            spacing={7}
        >
            <HStack
                width={"100%"}
                justifyContent={"space-evenly"}
            >
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
            {alert && <GenericAlert type="info" message="Orice slot apăsat din acest moment va fi șters"/>}
            <HStack
                width={"100%"}
                justifyContent={"space-evenly"}
            >
                <TimetableForm
                    year={year}
                    group={series}
                    day={day}
                    subjects={subjects.filter(s => s.year === secretary?.year_resp).map(s => s.subject)}
                    classes={classes}
                    isDisabled={disable} 
                    setTimeTables={setTimetables}
                    timetables={timetables}
                    timetablesRef={timetablesRef}
                    setNr={setNr}
                    />
                <Button
                    isDisabled={disable}
                    onClick={() => {
                        setDeleteState.toggle();
                        if (!alert && !deleteState) {
                            setAlert.on();
                            setTimeout(() => setAlert.off(), 3000);
                        }
                    }}
                    colorScheme="red"
                    width={"15%"}
                >{deleteState ? "Ieșire ștergere" : "Ștergere"}</Button>
            </HStack>
            {renderTimetables()}
        </VStack>
    );
}