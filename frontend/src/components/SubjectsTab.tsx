import {
    TabPanel,
    VStack,
    Box,
    SimpleGrid,
    Button,
    HStack,
    Popover,
    PopoverTrigger,
    Portal,
    PopoverContent,
    PopoverArrow,
    PopoverBody,
    Input,
    useBoolean
} from "@chakra-ui/react";

import { 
    addDoc,
    collection,
    deleteDoc,
    getDocs,
    query,
    where }
from "firebase/firestore";

import { db } from "../Firebase";
import { useEffect, useState } from "react";

interface SubjectProps {
    year: number
}

export interface Subject {
    subject: string,
    year: number
}

export const SubjectsTab: React.FC<SubjectProps> = (props) => {
    const [subjects, setSubjects] = useState<Array<Subject>>([]);
    
    let markedSubjects: Array<string> = [];

    useEffect(() => {
        let currentSubjects: Array<Subject> = [];
        const q = query(collection(db, "materii"), where("year", "==", props.year));
        getDocs(q)
            .then(docs => {
                docs.forEach(doc => currentSubjects.push(doc.data() as Subject));
            })
            .then(_ => setSubjects(currentSubjects));
    }, []);

    const SubjectEntry: React.FC<any> = (props) => {
        const { subject, idx } = props;
        const [marked, setMarked] = useBoolean();
        return (
            <Box
                key={`b_${idx}`}
                bg="#f0f4f7"
                fontWeight={500}
                fontStyle={"oblique"}
                minW={40}
                minH="50px"
                borderRadius="10px"
                boxShadow="7px 7px 13px #c3c3c3, -15px -15px 13px #fdfdfd"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border={'1px'}
                borderStyle={marked ? "solid" : "hidden"}
                borderColor={"red"}
                onClick={() => {
                    if (markedSubjects.includes(subject)) {
                        markedSubjects = markedSubjects.filter(s => s !== subject);
                        setMarked.off();
                        return;
                    }
                    markedSubjects.push(subject);
                    setMarked.on();
                }}
            >
                {subject}
            </Box>
        );
    }

    const mapSubjects = (subjects: Array<Subject>) =>
        subjects.map((sub, idx) => <SubjectEntry idx={`sub${idx}`} subject={sub.subject}/>);

    const PopoverAddForm: React.FC = () => {
        const [subjectName, setSubjectName] = useState<string>("");

        return (
            <Popover>
                <PopoverTrigger>
                    <Button colorScheme="green">Adaugă materie</Button>
                </PopoverTrigger>
                <Portal>
                    <PopoverContent h={200}>
                        <PopoverArrow />
                        <PopoverBody>
                            <VStack spacing={10} pt={30}>
                                <Input
                                    placeholder="Nume materie"
                                    value={subjectName}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setSubjectName(e.target.value);
                                    }}
                                />
                                <Button
                                    colorScheme='facebook'
                                    onClick={() => {
                                        const subjectData: Subject = {
                                            subject: subjectName,
                                            year: props.year
                                        }
                                        addDoc(collection(db, "materii"), subjectData)
                                            .then(_ => setSubjectName(""))
                                            .then(_ => setSubjects([subjectData, ...subjects]));
                                    }}
                                >
                                    Confirmare
                                </Button>
                            </VStack>
                        </PopoverBody>
                    </PopoverContent>
                </Portal>
            </Popover>
        );
    }

    return (
        // @ts-ignore
        <TabPanel display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <VStack>
                <HStack spacing={"10%"}>
                    <PopoverAddForm />
                    <Button
                        colorScheme="red"
                        onClick={() => {
                            const q = query(collection(db, "materii"), where("subject", "in", markedSubjects));
                            getDocs(q).then(
                                docs => docs.forEach(doc => {
                                    deleteDoc(doc.ref).then(_ => {});
                                })
                            ).then(_ => {
                                setSubjects(subjects.filter(s => !markedSubjects.includes(s.subject)));
                                markedSubjects = [];
                            });
                        }}
                    >
                        Șterge selecția
                    </Button>
                </HStack>
                <SimpleGrid columns={[2, null, 5]} spacing={10} pt={5}>
                    {mapSubjects(subjects)}
                </SimpleGrid>
            </VStack>
        </TabPanel>
    );
}