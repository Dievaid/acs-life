import {
    VStack,
    Text
} from "@chakra-ui/react";

import { Ticket, TicketProps } from "../components/ticket/Ticket";
import { collection, getDocs, query } from "@firebase/firestore";
import { db } from "../Firebase";
import { useEffect, useState } from "react";

export const TicketsView: React.FC = () => {

    const [tickets, setTickets] = useState<Array<TicketProps>>([]);

    const ticketsQuery = query(collection(db, "tichete"));

    useEffect(() => {
        let fetchedTickets: Array<TicketProps> = [];
        getDocs(ticketsQuery)
            .then(docs => {
                docs.forEach(
                    doc => {
                        let ticket = doc.data() as TicketProps;
                        fetchedTickets.push(ticket);
                    }
                )
            })
            .then(_ => setTickets(fetchedTickets));
    }, []);

    

    const renderTickets = () => {
        return tickets.map((t, idx) =>
            <Ticket
                key={`ticket${idx}`}
                author={t.author}
                title={t.title}
                message={t.message}
                date={t.date}
                status={t.status}
            />
        );
    }

    return (
        // @ts-ignore
        <VStack>
            <Text>Tickets page</Text>
            {renderTickets()}
            {/* <Ticket 
            author="catalin ioan balea"
            message="plm"
            title="big problem"
            status={true}
            date={new Date()}/>
            <Ticket 
            author="cata"
            message="sprijinul celor de la Bitdefender, vom organiza pe data de 20 mai 2023 un hackathon în format fizic destinat studenților de la SO. Hackathon-ul se va desfășura în echipe de 2 studenți (ambii de la SO) și va presupune rezolvarea unui exercițiu folosind informațiile acumulate de-a lungul cursurilor și laboratoarelor de SO. Subiectul propus este din zona sistemelor de operare, deci rezolvările necesită conceptele și API-urile învățate la SO."
            title="big problem"
            status={true}
            date={new Date()}/>
            <Ticket 
            author="cata"
            message="plm"
            title="big problem"
            status={true}
            date={new Date()}/> */}
        </VStack>
    );
}