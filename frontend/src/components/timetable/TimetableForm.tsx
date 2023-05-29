import { Box, Button, ButtonGroup, FocusLock, HStack, IconButton, Popover, PopoverArrow, PopoverCloseButton, PopoverContent, PopoverTrigger, Select, VStack, useDisclosure, useForceUpdate } from "@chakra-ui/react"
import { addDoc, collection } from "firebase/firestore"
import React, { useState } from "react"
import { db } from "../../Firebase"
import { TimetableData } from "../TimetablesView"

interface FormData {
    class: string,
    day: number,
    group: string,
    startHour: number,
    subject: string,
    type: string,
    year: number
}

interface TimetableFormdata {
    year: number,
    group: string,
    day: number,
    subjects: Array<string>,
    classes: Array<string>,
    isDisabled: boolean,
    setTimeTables: (value: Array<TimetableData>) => void,
    timetables: Array<TimetableData>,
    timetablesRef: any,
    setNr: React.Dispatch<React.SetStateAction<number>>

}

export const TimetableForm: React.FC<TimetableFormdata> = (props) => {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const firstFieldRef = React.useRef(null);

    
    const [formSubject, setFormSubject] = useState<string>("");
    const [formClass, setFormClass] = useState<string>("");
    const [formStartHour, setFormStartHour] = useState<number>(0);
    const [formType, setFormType] = useState<string>("");

    const pushDataToServer = () => {
        
        let addData: FormData = {
            class: formClass,
            day: props.day,
            group: props.group,
            startHour: formStartHour,
            subject: formSubject,
            type: formType,
            year: props.year,
        };
        console.log(addData);

        addDoc(collection(db, "orare"), addData)
            .then(_ => {
                props.timetablesRef.current.push(addData);
                props.setNr((prev) => prev + 1);
            })
            .catch(err => console.error(err));
    }

    const renderStartHours = () => {
        return Array.from({ length: 6 }, (_, i) => 8 + (i * 2)).map((h, idx) =>
            <option
                key={`hour${idx}`}
                value={h}
            >
                {"Ora " + h + ":00"}
            </option>)
    }

    const renderSubjects = () => {
        return props.subjects.map((s, idx) =>
            <option
                key={`subject${idx}`}
                value={s}
            >
                {s}
            </option>
        )
    }

    const renderClasses = () => {
        return props.classes.map((c, idx) =>
            <option
                key={`class${idx}`}
                value={c}
            >
                {c}
            </option>
        )
    }

    return (
        // @ts-ignore
        <HStack
            width={"15%"}
        >
            <Popover
                isOpen={isOpen}
                initialFocusRef={firstFieldRef}
                onOpen={onOpen}
                onClose={onClose}
                placement='right'
                closeOnBlur={false}
            >
                <PopoverTrigger>
                    <Button
                        isDisabled={props.isDisabled}
                        colorScheme="green"
                        width={"100%"}
                    >Adaugare</Button>
                </PopoverTrigger>
                {/* @ts-ignore */}
                <PopoverContent p={5}>
                    <FocusLock persistentFocus={false}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <VStack>
                            <Box width="100%">
                                Materia:
                            </Box>
                            <Select
                                bg='#E8E8E8'
                                placeholder='Selectați materia'
                                onChange={(e) => {
                                    e.preventDefault();
                                    setFormSubject(e.target.value)
                                }}
                            >
                                {renderSubjects()}
                            </Select>
                            <Box width="100%">
                                Tipul activitatii:
                            </Box>
                            <Select
                                bg='#E8E8E8'
                                placeholder='Selectați tipul activității'
                                onChange={(e) => {
                                    e.preventDefault();
                                    setFormType(e.target.value)
                                }}
                            >
                                <option value={"course"}>Curs</option>
                                <option value={"lab"}>Laborator</option>
                                <option value={"seminar"}>Seminar</option>
                            </Select>
                            <Box width="100%">
                                Grupa:
                            </Box>
                            <Select
                                bg='#E8E8E8'
                                placeholder='Selectați grupa'
                                onChange={(e) => {
                                    e.preventDefault();
                                    setFormClass(e.target.value)
                                }}
                            >
                                {renderClasses()}
                            </Select>
                            <Box width="100%">
                                Ora de inceput:
                            </Box>
                            <Select
                                bg='#E8E8E8'
                                placeholder='Selectați ora de început'
                                onChange={(e) => {
                                    e.preventDefault();
                                    setFormStartHour(+e.target.value);
                                }}
                            >
                                {renderStartHours()}
                            </Select>
                            <ButtonGroup display='flex' justifyContent='flex-end' spacing={10}>
                                <Button colorScheme="red">
                                    Cancel
                                </Button>
                                <Button colorScheme='green' onClick={_ => pushDataToServer()}>
                                    Save
                                </Button>
                            </ButtonGroup>

                        </VStack>
                    </FocusLock>
                </PopoverContent>
            </Popover>
        </HStack>
    );
}