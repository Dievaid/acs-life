import {
    Button,
    HStack,
    Input,
    VStack,
} from "@chakra-ui/react";
import { StudentsTable } from "./StudentsTable";
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { useEffect, useState } from "react";
import { WiFiLoader } from "./WiFiLoader";
import { StudentForm } from "./StudentForm";
import { RightSlideAnimation } from "../animations/RightSlideAnimation";
import { updateStudentsContext } from "./Contexts";

export interface Student {
    class: string,
    cnp: string,
    currentYear: number,
    email: string,
    group: string,
    name: string,
    surname: string,
    phone: string,
    srcPhoto: string
}

const tableColumns: Array<String> = [
    "Nume",
    "Email",
    "An curent",
    "CNP",
    "Grupa",
    "Serie",
    "Telefon"
];

export const StudentsView: React.FC = () => {
    const studentsQuery = query(collection(db, "studenti"));

    const [students, setStudents] = useState<Array<Student>>([]);
    const [deleteStudents, setDeleteStudents] = useState<Array<Student>>([]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [signUpFormShow, setSignUpFormShow] = useState<boolean>(false);
    const [deleteState, setDeleteState] = useState<boolean>(false);
    const [updateState, setUpdateState] = useState<boolean>(false);
    const [shouldUpdateData, setShouldUpdateData] = useState<boolean>(false);

    const [deleteBtnCaption, setDeleteBtnCaption] = useState<string>("Șterge studenți");
    const [updateBtnCaption, setUpdateBtnCaption] = useState<string>("Modifică studenți");
    const [filter, setFilter] = useState<string>("");

    const fetchStudents = () => {
        let students: Array<Student> = [];
        getDocs(studentsQuery)
            .then(res => res.forEach(doc => {
                let data: Student = doc.data() as Student;
                students.push(data);
            }))
            .then(_ => setStudents(students))
            .then(_ => setTimeout(() => setLoading(false), 500));
    }

    useEffect(fetchStudents, []);

    const handleDeleteStudents = () => {
        let q = query(collection(db, "/studenti"), 
            where("email", "in", deleteStudents.map(stud => stud.email)));
        getDocs(q).then(
            docs => docs.forEach(doc => {
                deleteDoc(doc.ref).then(_ => setDeleteStudents([]));
            })
        );
    }

    useEffect(() => {
        if (deleteState) {
            if (deleteStudents.length > 0) {
                setDeleteBtnCaption("Confirmare ștergere");
            } else {
                setDeleteBtnCaption("Ieșire ștergere");
            }
        } else {
            setDeleteBtnCaption("Ștergere studenți");
            if (updateState) {
                setUpdateBtnCaption("Confirmare modificări");
            } else {
                setUpdateBtnCaption("Modifică studenți");
            }
        }
    }, [deleteStudents, deleteState, updateState]);


    return (
        // @ts-ignore
        <VStack>
            {isLoading && <WiFiLoader />}
            {!isLoading &&
                <RightSlideAnimation duration={1} width={"90%"}>
                    {/* @ts-ignore */}
                    <HStack width={'100%'} justifyContent={"space-evenly"} pt={5}>
                        <Button 
                            colorScheme="green" 
                            onClick={() => setSignUpFormShow(true)}
                        >Adaugă student
                        </Button>
                        <Button 
                            colorScheme="red"
                            onClick={() => {
                                if (updateState) return;
                                if (!deleteState) {
                                    setDeleteState(true);
                                } else {
                                    if (deleteStudents.length !== 0) {
                                        let copyStudents = [...students];
                                        deleteStudents.forEach(stud1 => {
                                            copyStudents = copyStudents.filter(stud2 => stud1.email !== stud2.email);
                                        });
                                        setStudents(copyStudents);
                                        handleDeleteStudents();
                                    }
                                    setDeleteState(false);
                                }

                            }}
                        >{deleteBtnCaption}</Button>
                        <Button colorScheme="blue"
                            onClick={() => {
                                if (deleteState) return;
                                if (updateState) {
                                    setShouldUpdateData(true);
                                } else {
                                    setShouldUpdateData(false);
                                }
                                setUpdateState(!updateState);
                            }}
                        >
                            {updateBtnCaption}
                        </Button>
                        <Input
                            placeholder="Căutare"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            maxW="20%"
                        />
                        {signUpFormShow && 
                            <StudentForm 
                                callback={setSignUpFormShow}
                                students={students}
                                setStudents={setStudents}
                                />}
                    </HStack>
                    <updateStudentsContext.Provider value={shouldUpdateData}>
                        <StudentsTable
                            students={filter === "" ?
                                students : 
                                students.filter(s => 
                                    `${s.name} ${s.surname}`.toLowerCase()
                                        .match(filter.toLowerCase())
                                )
                            }
                            columns={tableColumns}
                            deleteStudents={deleteStudents}
                            setDeleteStudents={setDeleteStudents}
                            deleteState={deleteState}
                            updateState={updateState}
                        />
                    </updateStudentsContext.Provider>
                </RightSlideAnimation>
            }
        </VStack>
    );
}