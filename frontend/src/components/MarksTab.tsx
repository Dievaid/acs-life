import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    TabPanel,
    VStack,
    useBoolean
} from "@chakra-ui/react";

import { 
    useState,
    useEffect,
    useRef,
} from "react";

import { Subject } from "./SubjectsTab";
import { 
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    query,
    where
} from "firebase/firestore";
import { db } from "../Firebase";
import { Student } from "./StudentsView";
import { GenericAlert } from "./GenericAlert";
import { AnimatePresence } from "framer-motion";

interface MarkProps {
    year: number
}

interface StudentItemProps {
    name: string,
    surname: string,
    year: number,
    subjects: Array<Subject>,
    successCallback: () => void,
    errorCallback: () => void
}

const StudentItem: React.FC<StudentItemProps> = (props) => {
    const { subjects, name, surname, year, successCallback, errorCallback } = props;
    const marks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const [subject, setSubject] = useState<string>("");
    const [mark, setMark] = useState<number>(0);

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSubject(e.target.value);
    const handleMarkChange = (e: React.ChangeEvent<HTMLSelectElement>) => setMark(+e.target.value);
    const handleClick = (_ : any) => {
        const currentTimestamp = Timestamp.fromDate(new Date());

        const q = query(collection(db, "/catalog"),
            where("name", "==", name),
            where("surname", "==", surname),
            where("subject", "==", subject),
            where("timestamp", "<", currentTimestamp)
        );
        
        try {
            getDocs(q).then(docs => 
                docs.forEach(async (doc) => await deleteDoc(doc.ref)));
        }
        catch {
            errorCallback();
            setTimeout(() => errorCallback(), 2500);
            return;
        }

        addDoc(collection(db, "/catalog"), {
            subject: subject,
            mark: mark,
            name: name,
            surname: surname,
            year: year,
            timestamp: currentTimestamp
        })
        .then(_ => successCallback())
        .then(_ => setTimeout(() => successCallback(), 2500))
        .catch(_ => {
            errorCallback();
            setTimeout(() => errorCallback(), 2500);
        });
    }

    return (
        //@ts-ignore
        <AccordionItem>
            <h2>
                <AccordionButton>
                    <Box fontWeight={550} flex={1}>{`${name} ${surname}`}</Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
                <HStack spacing={10}>
                    <Select placeholder="Alege materia" 
                            onChange={handleSubjectChange}
                            value={subject}>
                        {subjects.map((sub, idx) => 
                            <option key={`opt_${idx}`} 
                                    value={sub.subject}>
                                {sub.subject}
                            </option>)
                        }
                    </Select>
                    <Select 
                        placeholder="Alege nota"
                        onChange={handleMarkChange}
                        value={mark}>
                        {marks.map((m, idx) => <option key={`c_${idx}`} placeholder={m.toString()}>{m}</option>)}
                    </Select>
                    <Button minW={"10%"} onClick={handleClick}>Validează</Button>
                </HStack>
            </AccordionPanel>
        </AccordionItem>
    );
}

export const MarksTab: React.FC<MarkProps> = (props) => {
    const [subjects, setSubjects] = useState<Array<Subject>>([]);
    const [students, setStudents] = useState<Array<Student>>([]);
    const [successState, setSuccess] = useBoolean();
    const [errorState, setError] = useBoolean();
    const [filter, setFilter] = useState<string>("");
    const studentsRef = useRef<Array<Student>>([]);

    useEffect(() => {
        const subjectDocs = query(collection(db, "/materii"), where("year", "==", props.year));
        const studentsDocs = query(collection(db, "/studenti"), where("currentYear", "==", props.year));
        let currentSubjects : Array<Subject> = [];
        let currentStudents : Array<Student> = [];
        getDocs(subjectDocs)
            .then(docs => docs.forEach(doc => currentSubjects.push(doc.data() as Subject)))
            .then(_ => setSubjects(currentSubjects));
        getDocs(studentsDocs)
            .then(docs => docs.forEach(doc => currentStudents.push(doc.data() as Student)))
            .then(_ => setStudents(currentStudents))
            .then(_ => studentsRef.current = currentStudents); 
    }, []);

    useEffect(() => {
        if (filter === "") {
            setStudents(studentsRef.current);
            return;
        }
        setStudents(studentsRef.current.filter(s => 
            `${s.name} ${s.surname}`.toLowerCase().match(filter.toLowerCase())));
    }, [filter]);

    return (
        // @ts-ignore
        <TabPanel>
            <AnimatePresence>
                {successState && <GenericAlert type="success" message="Nota a fost adăugată"/>}
                {errorState && <GenericAlert type="error" message="A apărut o problemă la adăugare"/>}
            </AnimatePresence>
            <VStack>
                <InputGroup
                    border={3}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                >
                    <InputLeftAddon children="Nume"/>
                    <Input
                        placeholder="Căutare"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </InputGroup>
                <Accordion w={"100%"} bg={"#fff"} maxH={"80%"} borderRadius={"10px"} allowToggle>
                    {students.map((stud, idx) => 
                        <StudentItem 
                            key={`stud${idx}`} 
                            name={stud.name}
                            surname={stud.surname}
                            year={props.year} 
                            subjects={subjects}
                            successCallback={setSuccess.toggle}
                            errorCallback={setError.toggle}/>
                    )}
                </Accordion>
            </VStack>
        </TabPanel>
    );
}