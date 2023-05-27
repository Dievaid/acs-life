import React from "react";
import {
    HStack,
    Box,
    Checkbox,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Button,
} from '@chakra-ui/react';

import { useState } from "react";
import { Timestamp } from "@firebase/firestore";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../Firebase";

export interface TicketProps {
    title: string,
    message: string,
    date: Timestamp,
    author: string,
    status: boolean
}

export const Ticket: React.FC<TicketProps> = (props) => {
    const [solved, setSolved] = useState<boolean>(props.status);

    const updateDocStatus = () => {
        let q = query(collection(db, "/tichete"),
            where("title", "==", props.title),
            where("date", "==", props.date)
        );
        getDocs(q).then(
            docs => docs.forEach(doc => {
                let newStatus = { ...props };
                newStatus.status = true;
                updateDoc(doc.ref, { ...newStatus })
            })
        ).then(_ => setSolved(true))
            .catch(_ => setSolved(false));
    }

    return (
        //@ts-ignore
        <Accordion
            allowToggle
            width="100%"
        >
            <AccordionItem
                dropShadow='lg'
                rounded='2xl'
                width="100%"
                bg='#89CFF0'
            >
                <h2>
                    <AccordionButton>
                        <HStack
                            width={"100%"}
                            spacing={"40px"}
                        >
                            <Box w='40%'
                                h='100%'
                                rounded='2xl'
                                bg='white'
                                display="flex"
                                alignItems="center"
                                justifyContent="center">
                                {props.title}
                            </Box>
                            <Box w='20%'
                                h='100%'
                                bg='white'
                                rounded='2xl'
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                {props.author}
                            </Box>
                            <Box w='20%'
                                h='100%'
                                bg='white'
                                rounded='2xl'
                                display="flex"
                                alignItems="center"
                                justifyContent="center">
                                {props.date.toDate().getHours().toString() + ":" +
                                    props.date.toDate().getMinutes().toString() + " " +
                                    props.date.toDate().getDate().toString() + "-" +
                                    (props.date.toDate().getMonth() + 1).toString() + "-" +
                                    (props.date.toDate().getFullYear()).toString()}
                            </Box>
                            <Checkbox
                                size="lg"
                                isReadOnly
                                iconColor="green"
                                colorScheme="black"
                                isChecked={solved}
                            />
                        </HStack>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={5}
                    display={"flex"}
                    flexDirection={"column"}
                    fontSize={"20px"}
                >
                    {props.message}
                    <Button
                        isDisabled={solved}
                        width={"10%"}
                        onClick={() => {
                            updateDocStatus();
                        }}

                        alignSelf={"center"}
                    >
                        Finalizează
                    </Button>
                </AccordionPanel>
            </AccordionItem>
        </Accordion >
    );
};