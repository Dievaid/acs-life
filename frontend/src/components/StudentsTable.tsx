import {
    TableContainer,
    Table,
    Tr,
    Th,
    Thead,
    Tbody,
    Td,
    TableCaption,
    Editable,
    EditablePreview,
    EditableInput,
} from "@chakra-ui/react";

import { Student } from "./StudentsView";
import { useContext, useEffect, useState } from "react";
import { updateStudentsContext } from "./Contexts";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../Firebase";

interface StudentsTableProps {
    students: Array<Student>,
    deleteStudents: Array<Student>,
    setDeleteStudents: (value: Array<Student>) => void,
    columns: Array<String>,
    deleteState: boolean,
    updateState: boolean,
}

interface StudentNodeProps {
    student: Student,
    deleteStudents: Array<Student>,
    setDeleteStudents: (value: Array<Student>) => void,
    idx: number,
    deleteState: boolean
    updateState: boolean,
}

const StudentNode : React.FC<StudentNodeProps> = (props) => {
    const [pressed, setPressed] = useState<boolean>(false);
    const { student, deleteStudents, setDeleteStudents, idx, deleteState, updateState } = props;

    const [editStudent, setEditStudent] = useState<Student>(student);

    const handleEmailChange = (email: string) => {
        let copyStudent = {...editStudent};
        copyStudent.email = email;
        setEditStudent(copyStudent);
    }

    const handleNameChange = (fullName: string) => {
        let copyStudent = {...editStudent};
        let names = fullName.split(" ");
        copyStudent.name = names[0];
        copyStudent.surname = names[1];
        setEditStudent(copyStudent);
    }

    const handleCnpChange = (cnp: string) => {
        let copyStudent = {...editStudent};
        copyStudent.cnp = cnp;
        setEditStudent(copyStudent);
    }

    const handleClassChange = (cl: string) => {
        let copyStudent = {...editStudent};
        copyStudent.class = cl;
        setEditStudent(copyStudent);
    }

    const handleGroupChange = (group: string) => {
        let copyStudent = {...editStudent};
        copyStudent.group = group;
        setEditStudent(copyStudent);
    }

    const handlePhoneNumberChange = (phoneNumber: string) => {
        let copyStudent = {...editStudent};
        copyStudent.phone = phoneNumber;
        setEditStudent(copyStudent);
    }

    const createTableCell = (e: any, callback: (value: string) => void) => {
        if (updateState) {
            return (
                // @ts-ignore
                <Editable defaultValue={e} onChange={(val) => callback(val)}>
                    <EditablePreview />
                    {updateState && <EditableInput />}
                </Editable>
            );
        }
        return <>{e}</>
    }

    const shouldUpdateData = useContext(updateStudentsContext);

    useEffect(() => {
        if (shouldUpdateData) {
            if (editStudent !== student) {
                let q = query(collection(db, "/studenti"), where("email", "==", student.email));
                getDocs(q).then(
                    docs => docs.forEach(doc => {
                        updateDoc(doc.ref, {...editStudent});
                    })
                );
            }
        }
    }, [shouldUpdateData]);

    useEffect(() => {
        setEditStudent(student);
    }, [student])

    return (
        // @ts-ignore
        <Tr key={idx} onClick={() => {
            if (deleteState) {
                if (pressed === false) {
                    setDeleteStudents([editStudent, ...deleteStudents]);
                }
                else {
                    setDeleteStudents(deleteStudents.filter(stud => stud.email !== editStudent.email));
                }
                setPressed(!pressed);
            }
        }} backgroundColor={pressed && deleteState ? "#FB6A5E" : ""}>
            <Td>{createTableCell(`${editStudent.name} ${editStudent.surname}`, handleNameChange)}</Td>
            <Td>{createTableCell(editStudent.email, handleEmailChange)}</Td>
            <Td>{editStudent.currentYear}</Td>
            <Td>{createTableCell(editStudent.cnp, handleCnpChange)}</Td>
            <Td>{createTableCell(editStudent.class, handleClassChange)}</Td>
            <Td>{createTableCell(editStudent.group, handleGroupChange)}</Td>
            <Td>{createTableCell(editStudent.phone, handlePhoneNumberChange)}</Td>
        </Tr>
    );
}

export const StudentsTable: React.FC<StudentsTableProps> = (props: StudentsTableProps) => {
    const renderColumns = (cols: Array<String>) => {
        // @ts-ignore
        return cols.map((col, idx) => <Th key={idx}>{col}</Th>);
    }

    const renderStudents = (students: Array<Student>, deleteState: boolean, updateState: boolean) => {
        return students.map((student, idx) => 
            <StudentNode
                key={`sn_${idx}`} 
                idx={idx} 
                deleteStudents={props.deleteStudents} 
                setDeleteStudents={props.setDeleteStudents}
                student={student}
                deleteState={deleteState}
                updateState={updateState}
            />
        );
    }

    return (
        // @ts-ignore
        <TableContainer w={'100%'} pt={5} h={'100%'}>
            <Table variant='simple' 
                borderColor={props.deleteState ? "#FB6A5E" : props.updateState ? "#2b6cb0" : ""} 
                borderWidth={"2px"}
                borderStyle={props.deleteState || props.updateState ? "solid" : "hidden"}
                >
                {props.deleteState && 
                <TableCaption color={"#FB6A5E"}>Te afli în modul de ștergere</TableCaption>}
                {props.updateState && 
                <TableCaption color={"#2b6cb0"}>Te afli în modul de modificare</TableCaption>}
                <Thead>
                    <Tr>
                        {renderColumns(props.columns)}
                    </Tr>
                </Thead>
                <Tbody>
                    {renderStudents(props.students, props.deleteState, props.updateState)}
                </Tbody>
            </Table>
        </TableContainer>
    );
}