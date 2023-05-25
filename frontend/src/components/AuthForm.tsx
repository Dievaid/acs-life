import {
    Button,
    Container,
    FormControl,
    FormLabel, 
    Input, 
    VStack,
    CloseButton,
    Text,
    useBoolean,
} from "@chakra-ui/react";

import {
    useContext,
    useEffect,
    useRef,
    useState
} from "react";

import "../stylesheets/AuthForm.css";
import { mainPageContext } from "./Contexts";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

const validateEmail = (email: string) => {
    // eslint-disable-next-line
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

const AuthForm: React.FC = () => {
    const url: string = "https://email-server-unv4.onrender.com";

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isValidEmail, setValidEmail] = useState<boolean>(false);
    const [isDataInvalid, setDataInvalid] = useState<boolean>(false);

    const [loginPressed, setLoginPressed] = useBoolean();
    
    const otpRef = useRef<any>(null);
    const otpReady = useRef<boolean>(false);

    const sendCodeTo = (email: string) => {
        const dto = {email: email};
        return axios.post(`${url}/get-otp`, dto);
    }

    const validateCode = (email: string, otp: string) => {
        const dto = {email: email, otp: otp};
        return axios.post(`${url}/verify-otp`, dto);
    }

    const awaitInput = () => {
        return new Promise<any>((resolve) => {
            const checkCondition = () => {
                if (otpReady.current) {
                    const data = {email: email, otp: otpRef.current.value};
                    resolve(data);
                } else {
                    setTimeout(checkCondition);
                }
            }
            checkCondition();
        });
    }

    const setFormAppearance = useContext(mainPageContext);
    const navigate = useNavigate();

    const login = () => {
        if (process.env.REACT_APP_DISABLE_OTP === "false") {
            setLoginPressed.on();
        }
        const q = query(collection(db, "/secretari"), where("email", "==", email));
        getDocs(q).then(snap => {
            if (snap.empty) {
                setDataInvalid(true);
                setLoginPressed.off();
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
                    sendCodeTo(email).then(async () => {
                        const data = await awaitInput();
                        const result = await validateCode(data.email, data.otp);

                        if (result.data.status === "success") {
                            navigate("/admin-panel");
                        } else {
                            throw Error("OTP greșit");
                        }
                    }).catch(err=> {
                        console.error(err);
                        signOut(auth);
                    });
                })
                .catch(err => {
                    console.error(err);
                    setDataInvalid(true);
                    setLoginPressed.off();
                });
            }
        )
    }
    
    useEffect(() => {
        setValidEmail(validateEmail(email));
    }, [email]);

    return (
        // @ts-ignore
        <Container className="form" maxW='30vw' minW='170px' h='350px' overflow="hidden">
            <CloseButton 
                className="closeBtn"
                onClick={() => setFormAppearance(false)}
            />            
            <AnimatePresence>
                {!loginPressed && 
                <motion.div
                    key={"id_form"}
                    initial={{opacity: 0, y: 100}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: loginPressed ? 0.5 : 1}}
                    exit={{opacity: 0, y: -50}}
                >
                    <FormControl isInvalid={!isValidEmail}>
                        <VStack spacing={4}>
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
                                isLoading={loginPressed}
                                onClick={login}
                            >
                                Autentificare
                            </Button>
                            {isDataInvalid && <Text pb={5} color={"red"}>Datele introduse sunt invalide</Text>}
                        </VStack>
                    </FormControl>
                </motion.div>}
                {(loginPressed !== isDataInvalid) &&
                <motion.div
                    key={"id_otp"}
                    initial={{opacity: 0, y: 100}}
                    animate={{opacity: 1, y: 50}}
                    transition={{duration: 1, delay: 0.5}}
                    exit={{opacity: 0, y: -50}}
                >
                    <VStack spacing={6}>
                        <FormLabel>Cod otp</FormLabel>
                        <Input ref={otpRef}/>
                        <Button onClick={() => otpReady.current = true}>Trimite cod</Button>
                    </VStack>
                </motion.div>}
            </AnimatePresence>
        </Container>
    );
}

export default AuthForm;