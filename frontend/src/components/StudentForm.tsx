import {
    Button,
    CloseButton,
    Input,
    VStack
} from "@chakra-ui/react";

import "../stylesheets/StudentForm.css";
import { useFormik } from "formik";
import { Student } from "./StudentsView";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../Firebase";

interface FormProps {
    callback: (value: any) => void;
    students: Array<Student>,
    setStudents: (value: Array<Student>) => void,
}

export const StudentForm: React.FC<FormProps> = (props) => {
    const formik = useFormik<Student>({
        initialValues: {
            class: '',
            cnp: '',
            currentYear: 1,
            email: '',
            group: '',
            name: '',
            surname: '',
            phone: '',
            srcPhoto: 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
        },
        onSubmit: values => {
            console.log(values);
            addDoc(collection(db, "/studenti"), values)
                .then(_ => console.log(values))
                .then(_ => {
                    let copyStudents: Array<Student> = [...props.students];
                    copyStudents.push(values);
                    props.setStudents(copyStudents);
                })
                .then(_ => props.callback(false))
                .catch(err => console.error(err));
        }
    });

    return (
        // @ts-ignore
        <VStack className="formstud" justifyContent={"center"} position={"absolute"} top={"15%"} minW={"400px"}>
            <form onSubmit={formik.handleSubmit}>
            <VStack minW={'200px'} pt={5} pb={5}>
                <Input id="surname" placeholder="Nume" value={formik.values.surname} onChange={formik.handleChange}></Input>
                <Input id="name" placeholder="Prenume" value={formik.values.name} onChange={formik.handleChange}></Input>
                <Input id="cnp" placeholder="CNP" value={formik.values.cnp} onChange={formik.handleChange}></Input>
                <Input id="phone" placeholder="Telefon" value={formik.values.phone} onChange={formik.handleChange}></Input>
                <Input id="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange}></Input>
                <Input id="currentYear" placeholder="An" value={formik.values.currentYear} onChange={formik.handleChange}></Input>
                <Input id="class" placeholder="Grupa" value={formik.values.class} onChange={formik.handleChange}></Input>
                <Input id="group" placeholder="Serie" value={formik.values.group} onChange={formik.handleChange}></Input>
                <Button type="submit">Înscrie student</Button>
                <CloseButton onClick={() => props.callback(false)}/>
            </VStack>
            </form>
        </VStack>
    );
}