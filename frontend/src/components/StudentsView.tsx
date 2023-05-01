import {
    Button,
    HStack,
    Input,
    VStack,
} from "@chakra-ui/react";
import { StudentsTable } from "./StudentsTable";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { useEffect, useState } from "react";
import { WiFiLoader } from "./WiFiLoader";
import { StudentForm } from "./StudentForm";

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

    const [deleteBtnCaption, setDeleteBtnCaption] = useState<string>("Șterge studenți");

    const fetchStudents = () => {
        let students: Array<Student> = [];
        getDocs(studentsQuery)
            .then(res => res.forEach(doc => {
                let data: Student = doc.data() as Student;
                students.push(data);
            }))
            .then(_ => setStudents(students))
            .then(_ => setTimeout(() => setLoading(false), 1000));
    }

    useEffect(fetchStudents, []);

    const handleDeleteStudent = (email: string) => {
        let q = query(collection(db, "/studenti"), where("email", "==", email))
        let id: string | null = null;
        getDocs(q)
            .then(docs => docs.forEach(doc => {
               id = doc.id;
            }))
            .then(_ => {
                if (id !== null) {
                    console.log(id);
                    deleteDoc(doc(db, "/studenti", id))
                }
            });
    }

    return (
        // @ts-ignore
        <VStack>
            {isLoading && <WiFiLoader />}
            {!isLoading &&
                <HStack width={'100%'} justifyContent={"space-evenly"} pt={5}>
                    <Button 
                        colorScheme="green" 
                        onClick={() => setSignUpFormShow(true)}
                    >Adaugă student
                    </Button>
                    <Button 
                        colorScheme="red"
                        onClick={() => {
                            if (!deleteState) {
                                setDeleteState(true);
                            } else {
                                if (students.length !== 0) {
                                    let copyStudents = [...students];
                                    deleteStudents.forEach(stud1 => {
                                        copyStudents = copyStudents.filter(stud2 => stud1.email !== stud2.email);
                                    });
                                    setStudents(copyStudents);

                                    deleteStudents.forEach(stud => {
                                        handleDeleteStudent(stud.email);
                                    });
                                    setDeleteStudents([]);
                                }
                                setDeleteState(false);
                            }

                        }}
                    >{deleteBtnCaption}</Button>
                    <Button colorScheme="blue">Modifică student</Button>
                    {signUpFormShow && 
                        <StudentForm 
                            callback={setSignUpFormShow}
                            students={students}
                            setStudents={setStudents}
                            />}
                </HStack>
            }
            {!isLoading && 
                <StudentsTable
                    students={students}
                    columns={tableColumns}
                    deleteStudents={deleteStudents}
                    setDeleteStudents={setDeleteStudents}
                    deleteState={deleteState}
                    setDeleteState={setDeleteState}
                    setDeleteBtnCaption={setDeleteBtnCaption}
                />
            }
        </VStack>
    );
}