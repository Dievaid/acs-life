import {
    VStack,
    Text,
    HStack,
} from "@chakra-ui/react";
import { collection, getDocs, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import CountUp from 'react-countup';
import { SecretaryContext } from "./AuthProvider";
import { db } from "../Firebase";
import { Student } from "./StudentsView";

export const HomeView: React.FC = () => {
    const secretary = useContext(SecretaryContext);
    const year = (secretary == null) ? 0 : secretary?.year_resp;
    const studentsQuery = query(collection(db, "studenti"));

    const [studentsNumber, setStudentsNumber] = useState<number>(0);
    const [studentsNumberYear, setStudentsNumberYear] = useState<number>(0);
    const fetchStudents = () => {
        let count = 0;
        let countYear = 0;
        getDocs(studentsQuery)
            .then(res => res.forEach(doc => {
                count++;
                let data: Student = doc.data() as Student;
                countYear += (data.currentYear === year) ? 1 : 0;
            }))
            .then(_ => setStudentsNumber(count))
            .then(_ => setStudentsNumberYear(countYear));
    }

    useEffect(fetchStudents, []);

    return (
        // @ts-ignore
        <VStack>
            <Text>Home page</Text>
            <VStack
                alignItems="flex-start"
                width={"80%"}

            >
                <HStack
                    bg={"#89CFF0"}
                    rounded={"xl"}
                >
                    <Text
                        style={{ fontSize: 30 }}
                    >
                        Numar de studenti:
                    </Text>
                    <CountUp
                        style={{ fontSize: 50 }}
                        end={studentsNumber}
                        duration={5} />
                </HStack>
                <HStack
                    bg={"#89CFF0"}
                    rounded={"xl"}
                >
                    <Text
                        style={{ fontSize: 30 }}
                    >
                        Numar de studenti in anul curent:
                    </Text>
                    <CountUp
                        style={{ fontSize: 50 }}
                        end={studentsNumberYear}
                        duration={5} />
                </HStack>
            </VStack>



        </VStack>
    );
}