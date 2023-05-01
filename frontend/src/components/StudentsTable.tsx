import {
    TableContainer,
    Table,
    Tr,
    Th,
    Thead,
    Tbody,
    Td,
    TableCaption,
} from "@chakra-ui/react";

import { Student } from "./StudentsView";
import { useEffect, useState } from "react";

interface StudentsTableProps {
    students: Array<Student>,
    deleteStudents: Array<Student>,
    setDeleteStudents: (value: Array<Student>) => void,
    columns: Array<String>,
    deleteState: boolean,
    setDeleteState: (value: boolean) => void,
    setDeleteBtnCaption: (value: string) => void
}

interface StudentNodeProps {
    student: Student,
    deleteStudents: Array<Student>,
    setDeleteStudents: (value: Array<Student>) => void,
    idx: number,
    deleteState: boolean,
}

const StudentNode : React.FC<StudentNodeProps> = (props) => {
    const [pressed, setPressed] = useState<boolean>(false);
    const { student, deleteStudents, setDeleteStudents, idx, deleteState } = props;
    return (
        // @ts-ignore
        <Tr key={idx} onClick={() => {
            if (deleteState) {
                if (pressed === false) {
                    setDeleteStudents([student, ...deleteStudents]);
                }
                else {
                    setDeleteStudents(deleteStudents.filter(stud => stud.email !== student.email));
                }
                setPressed(!pressed);
            }
        }} backgroundColor={pressed && deleteState ? "#FB6A5E" : ""}>
            <Td>{`${student.name} ${student.surname}`}</Td>
            <Td>{student.email}</Td>
            <Td>{student.currentYear}</Td>
            <Td>{student.cnp}</Td>
            <Td>{student.class}</Td>
            <Td>{student.group}</Td>
            <Td>{student.phone}</Td>
        </Tr>
    );
}

export const StudentsTable: React.FC<StudentsTableProps> = (props: StudentsTableProps) => {
    const renderColumns = (cols: Array<String>) => {
        // @ts-ignore
        return cols.map((col, idx) => <Th key={idx}>{col}</Th>);
    }

    const renderStudents = (students: Array<Student>, deleteState: boolean) => {
        return students.map((student, idx) => 
            <StudentNode 
                idx={idx} 
                deleteStudents={props.deleteStudents} 
                setDeleteStudents={props.setDeleteStudents}
                student={student}
                deleteState={deleteState}
            />
        );
    }

    useEffect(() => {
        if (props.deleteState) {
            if (props.deleteStudents.length > 0) {
                props.setDeleteBtnCaption("Confirmare ștergere");
            } else {
                props.setDeleteBtnCaption("Ieșire ștergere");
            }
        } else {
            props.setDeleteBtnCaption("Ștergere studenți");
        }
    }, [props.deleteStudents, props.deleteState]);

    return (
        // @ts-ignore
        <TableContainer minW={'90%'} pt={5} maxH={'95%'}>
            <Table variant='simple' 
                borderColor={props.deleteState ? "#FB6A5E" : ""} 
                borderWidth={"2px"}
                borderStyle={props.deleteState ? "solid" : "hidden"}
                >
                {props.deleteState && 
                <TableCaption color={"#FB6A5E"}>Te afli în modul de ștergere</TableCaption>}
                <Thead>
                    <Tr>
                        {renderColumns(props.columns)}
                    </Tr>
                </Thead>
                <Tbody>
                    {renderStudents(props.students, props.deleteState)}
                </Tbody>
            </Table>
        </TableContainer>
    );
}