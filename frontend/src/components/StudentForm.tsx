import {
    Button,
    CloseButton,
    Input,
    VStack,
    useForceUpdate
} from "@chakra-ui/react";

import "../stylesheets/StudentForm.css";
import { useFormik } from "formik";
import { Student } from "./StudentsView";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../Firebase";
import { FadeInAnimation } from "../animations/FadeInAnimation";
import { 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail
} from "firebase/auth";
import { useContext } from "react";
import { SecretaryContext } from "./AuthProvider";

interface FormProps {
    callback: (value: any) => void;
    students: Array<Student>,
    setStudents: (value: Array<Student>) => void,
}

export const StudentForm: React.FC<FormProps> = (props) => {
    const update = useForceUpdate();
    const secretary = useContext(SecretaryContext);

    const formik = useFormik<Student>({
        initialValues: {
            class: '',
            cnp: '',
            currentYear: secretary === null ? 0 : secretary.year_resp,
            email: '',
            group: '',
            name: '',
            surname: '',
            phone: '',
            srcPhoto: 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'
        },
        onSubmit: values => {
            if (process.env.REACT_APP_STUD_ACC === "true") {
                createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    Math.random().toString(36).slice(-8) //! random password
                ).then(async _ =>  await sendPasswordResetEmail(auth, values.email))
            }

            addDoc(collection(db, "/studenti"), values)
                .then(_ => {
                    props.setStudents([...props.students, values]);
                    update();
                })
                .then(_ => props.callback(false))
                .catch(err => console.error(err));
        }
    });

    return (
        // @ts-ignore
        <VStack className="formstud" justifyContent={"center"} position={"absolute"} top={"20vh"} minW={"400px"}>
            <FadeInAnimation duration={1}>
                <form onSubmit={formik.handleSubmit}>
                <VStack minW={'200px'} pt={5} pb={5}>
                    <Input id="surname" placeholder="Nume" value={formik.values.surname} onChange={formik.handleChange}></Input>
                    <Input id="name" placeholder="Prenume" value={formik.values.name} onChange={formik.handleChange}></Input>
                    <Input id="cnp" placeholder="CNP" value={formik.values.cnp} onChange={formik.handleChange}></Input>
                    <Input id="phone" placeholder="Telefon" value={formik.values.phone} onChange={formik.handleChange}></Input>
                    <Input id="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange}></Input>
                    <Input id="currentYear" placeholder="An" value={formik.values.currentYear}></Input>
                    <Input id="class" placeholder="Grupa" value={formik.values.class} onChange={formik.handleChange}></Input>
                    <Input id="group" placeholder="Serie" value={formik.values.group} onChange={formik.handleChange}></Input>
                    <Button isDisabled={formik.values.currentYear === 0} type="submit">Înscrie student</Button>
                    <CloseButton onClick={() => props.callback(false)}/>
                </VStack>
                </form>
            </FadeInAnimation>
        </VStack>
    );
}