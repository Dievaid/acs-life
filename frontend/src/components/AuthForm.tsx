import {
    Button,
    Container,
    FormControl,
    FormLabel, 
    Input, 
    VStack,
    CloseButton
} from "@chakra-ui/react";

import { useContext, useState } from "react";

import "../stylesheets/AuthForm.css";
import { mainPageContext } from "./Contexts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";

const validateEmail = (email: string) => {
    // eslint-disable-next-line
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

const AuthForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isValidEmail, setValidEmail] = useState<boolean>(false);

    const setFormAppearance = useContext(mainPageContext);

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => console.log(userCredentials))
            .then(_ => window.location.replace("/admin-panel"))
            .catch(err => console.error(err));
    }
    
    return (
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
                        }}
                    />
                    <FormLabel>Parola</FormLabel>
                    <Input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button 
                        disabled={!isValidEmail}
                        variant='solid'
                        colorScheme='facebook'
                        onClick={login}
                    >
                        Autentificare
                    </Button>
                </VStack>
            </FormControl>
        </Container>
    );
}

export default AuthForm;