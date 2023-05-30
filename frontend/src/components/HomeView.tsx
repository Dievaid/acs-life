import {
    VStack,
    Text,
    SimpleGrid,
} from "@chakra-ui/react";
import { collection, getDocs, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { SecretaryContext } from "./AuthProvider";
import { db } from "../Firebase";
import { Student } from "./StudentsView";
import { DataCard } from "./DataCard";
import { 
    HiAcademicCap,
    HiDatabase,
    HiBriefcase
} from "react-icons/hi";
import { FadeInAnimation } from "../animations/FadeInAnimation";

export const HomeView: React.FC = () => {
    const secretary = useContext(SecretaryContext);
    const [studentsNumber, setStudentsNumber] = useState<number>(0);
    const [studentsNumberYear, setStudentsNumberYear] = useState<number>(0);
    const [subjects, setSubjects] = useState<number>(0);

    const fetchStudents = () => {
        let count = 0;
        let countYear = 0;
        const studentsQuery = query(collection(db, "studenti"));
        getDocs(studentsQuery)
            .then(res => res.forEach(doc => {
                count++;
                let data: Student = doc.data() as Student;
                countYear += (data.currentYear === secretary?.year_resp) ? 1 : 0;
            }))
            .then(_ => setStudentsNumber(count))
            .then(_ => setStudentsNumberYear(countYear));
    }

    const fetchSubjects = () => {
        const subjectsQuery = query(collection(db, "materii"));
        let count = 0;
        getDocs(subjectsQuery)
            .then((docs) => docs.forEach(() => count++))
            .then(() => setSubjects(count));
    }

    useEffect(fetchStudents, []);
    useEffect(fetchSubjects, []);

    return (
        // @ts-ignore
        <VStack pt={"8vw"}>
            <FadeInAnimation duration={1}>
                <Text
                    pt={5} 
                    fontSize={50}
                    fontWeight={500}
                    fontStyle={"italic"}
                >
                    Bine ai revenit!
                </Text>
            </FadeInAnimation>

            <FadeInAnimation duration={1.5}>
                <SimpleGrid pt={10} columns={[1, null, 3]} spacing={"5vw"}>
                    <DataCard
                        icon={HiAcademicCap}
                        labelData={studentsNumber}
                        labelStat="Studenți"
                    />
                    <DataCard 
                        icon={HiBriefcase}
                        labelData={studentsNumberYear}
                        labelStat="Studenți an curent"
                    />
                    <DataCard 
                        icon={HiDatabase}
                        labelData={subjects}
                        labelStat="Materii"
                    />
                </SimpleGrid>
            </FadeInAnimation>
        </VStack>
    );
}