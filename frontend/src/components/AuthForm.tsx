import {
    Button,
    Container,
    FormControl,
    FormLabel, 
    Input, 
    VStack,
    CloseButton,
    Text
} from "@chakra-ui/react";

import { useContext, useEffect, useState } from "react";

import emailjs from "emailjs-com";

import "../stylesheets/AuthForm.css";
import { mainPageContext } from "./Contexts";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";

const validateEmail = (email: string) => {
    // eslint-disable-next-line
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

const AuthForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isValidEmail, setValidEmail] = useState<boolean>(false);
    const [isDataInvalid, setDataInvalid] = useState<boolean>(false);
    
    let otp: string = ""

    const sendCodeTo = (email: string) => {
        let otp_code = new String(Math.floor(100000 + Math.random() * 100000));
        let data = {
            user_email: email,
            otp_code: otp_code
        }
        console.log(otp_code.toString());
        otp = otp_code.toString();
        return emailjs.send("service_gkhhhwj","template_quufkg5", data, "HBgT6C9tOLxagn0Cz");
    }

    const setFormAppearance = useContext(mainPageContext);
    const navigate = useNavigate();

    const login = () => {
        const q = query(collection(db, "/secretari"), where("email", "==", email));
        getDocs(q).then(snap => {
            if (snap.empty) {
                setDataInvalid(true);
                throw Error("Email negăsit");
            }
        })
        .then(_ => {
            signInWithEmailAndPassword(auth, email, password)
                .then(_ => {
                    if (process.env.REACT_APP_DISABLE_OTP === "true") {
                        navigate("/admin-panel");
                        return;
                    }
                    sendCodeTo(email).then(_ => {
                        let input_code = prompt("Tastează codul primit pe email");
                        if (input_code === otp) { 
                            navigate("/admin-panel");
                        } else {
                            throw Error(`OTP greșit`);
                        }
                    }).catch(err=> {
                        console.error(err);
                        signOut(auth);
                    });
                })
                .catch(err => {
                    console.error(err);
                    setDataInvalid(true);
                });
            }
        )
    }
    
    useEffect(() => {
        setValidEmail(validateEmail(email));
    }, [email]);

    return (
        // @ts-ignore
        <Container className="form" maxW='30vw' minW='170px' minH='350px'>
            <CloseButton 
                className="closeBtn"
                onClick={() => setFormAppearance(false)}
            /> 
            <FormControl isInvalid={!isValidEmail}>
                <VStack spacing={6}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type='email'
                        value={email} 
                        onChange={(e) => {
                            e.preventDefault();
                            setEmail(e.target.value);
                            setDataInvalid(false);
                        }}
                    />
                    <FormLabel>Parola</FormLabel>
                    <Input
                        type='password'
                        value={password}
                        onChange={(e) => {
                            e.preventDefault();
                            setPassword(e.target.value);
                            setDataInvalid(false);
                        }}
                    />
                    <Button 
                        disabled={!isValidEmail}
                        variant='solid'
                        colorScheme='facebook'
                        onClick={login}
                    >
                        Autentificare
                    </Button>
                    {isDataInvalid && <Text pb={5} color={"red"}>Datele introduse sunt invalide</Text>}
                </VStack>
            </FormControl>
        </Container>
    );
}

export default AuthForm;