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

import { useContext, useState } from "react";

import "../stylesheets/AuthForm.css";
import { mainPageContext } from "./Contexts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";

const validateEmail = (email: string) => {
    // eslint-disable-next-line
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

const AuthForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isValidEmail, setValidEmail] = useState<boolean>(false);
    const [isDataInvalid, setDataInvalid] = useState<boolean>(false);

    const setFormAppearance = useContext(mainPageContext);
    const navigate = useNavigate();

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(_ => navigate("/admin-panel"))
            .catch(err => {
                console.error(err);
                setDataInvalid(true);
            });
    }
    
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
                            setEmail(e.target.value);
                            setValidEmail(validateEmail(email));
                            setDataInvalid(false);
                        }}
                    />
                    <FormLabel>Parola</FormLabel>
                    <Input
                        type='password'
                        value={password}
                        onChange={(e) => {
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