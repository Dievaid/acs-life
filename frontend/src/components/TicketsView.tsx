import {
    VStack
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
        return tickets.sort((t1, t2) => +t2.date.valueOf() - +t1.date.valueOf()).map((t, idx) =>
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
            {renderTickets()}
        </VStack>
    );
}