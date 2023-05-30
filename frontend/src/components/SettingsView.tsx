import {
    VStack,
    Input,
    FormControl,
    Button,
    HStack,
    Center,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from "./AuthProvider";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db, storage } from "../Firebase";
import { UserDataContext } from "./Contexts";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface SecretaryData {
    surname: string,
    name: string,
    email: string,
    img?: string,
    year_resp: number
}

export const SettingsView: React.FC = () => {
    const [secretary, setSecretary] = useState<SecretaryData>({
        surname: '',
        name: '',
        email: '',
        year_resp: 0
    });
    const user = useContext(AuthContext);
    useEffect(() => {
        if (user == null)
            return;
        const q = query(collection(db, "secretari"), where("email", "==", user?.email));
        getDocs(q)
            .then(docs =>
                docs.forEach(doc => setSecretary(doc.data() as SecretaryData)))
    }, []);

    const nameRef = useRef<any>();
    const surnameRef = useRef<any>();
    const emailRef = useRef<any>();
    const yearRef = useRef<any>();
    const userData = useContext(UserDataContext);
    const fileRef = useRef<HTMLInputElement | null>(null);

    const onButtonClick = () => {
        fileRef.current?.click();
    };

    const onFileChange = () => {
        const image = ref(storage, `${secretary.email}.jpg`);
        if (fileRef.current && fileRef.current.files) {
            uploadBytes(image, fileRef.current.files[0]).then((snap) => {
                const secretaryCopy = { ...secretary };
                getDownloadURL(snap.ref).then(url => {
                    secretaryCopy.img = url;
                    setSecretary(secretaryCopy);
                    const q = query(collection(db, "/secretari"), where("email", "==", secretary.email));
                    getDocs(q).then(
                        docs => docs.forEach(async (doc) =>
                            await updateDoc(doc.ref, secretaryCopy))
                    );
                });
            });
        }
    }

    const handleSave = () => {
        const updateSecretary: SecretaryData = {
            email: emailRef.current.value === "" ? secretary.email : emailRef.current.value,
            name: nameRef.current.value === "" ? secretary.name : nameRef.current.value,
            surname: surnameRef.current.value === "" ? secretary.surname : surnameRef.current.value,
            year_resp: yearRef.current.value === "" ? Number(secretary.year_resp) : yearRef.current.value,
            img: secretary.img
        };
        const q = query(collection(db, "/secretari"), where("email", "==", secretary.email));
        getDocs(q).then(
            docs => docs.forEach((doc) =>
                updateDoc(doc.ref, { ...updateSecretary })
                    .then(_ => setSecretary(updateSecretary))
                    .then(_ => {
                        const stringSurname = surnameRef.current.value === "" ? secretary.surname : surnameRef.current.value;
                        const stringName = nameRef.current.value === "" ? secretary.name : nameRef.current.value;
                        userData?.setName(`${stringName} ${stringSurname}`);
                    })
                    .then(_ => {
                        nameRef.current.value = "";
                        surnameRef.current.value = "";
                        emailRef.current.value = "";
                        yearRef.current.value = "";
                    })
            )
        );
    }

    return (
        // @ts-ignore
        <VStack>
            <FormControl w="100%">
                <HStack>
                    <Center minW={"100px"} fontWeight={500}>Nume</Center>
                    <Input placeholder={secretary.surname} ref={surnameRef} />
                </HStack>

                <HStack>
                    <Center minW={"100px"} fontWeight={500}>Prenume</Center>
                    <Input placeholder={secretary.name} ref={nameRef} />
                </HStack>

                <HStack>
                    <Center minW={"100px"} fontWeight={500}>Email</Center>
                    <Input placeholder={secretary.email} ref={emailRef} />
                </HStack>

                <HStack>
                    <Center minW={"100px"} fontWeight={500}>An</Center>
                    <Input placeholder={secretary.year_resp.toString()} ref={yearRef} />
                </HStack>
            </FormControl>
            <HStack spacing={6}>
                <Button minW={"100px"} fontWeight={500} onClick={onButtonClick}>
                    <Input type="file" id="file" display={"none"} ref={fileRef} onChange={onFileChange}
                        accept="image/png, image/jpeg, image/jpg" />
                    Încărcare Poză Profil
                </Button>
                <Button minW={"100px"} type="submit" onClick={handleSave}>Modifică date</Button>
            </HStack>
        </VStack>
    );
}