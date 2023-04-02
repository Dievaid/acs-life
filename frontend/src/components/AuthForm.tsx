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

const validateEmail = (email: string) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

const AuthForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isValidEmail, setValidEmail] = useState<boolean>(false);

    const setFormAppearance = useContext(mainPageContext);
    
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
                    >
                        Autentificare
                    </Button>
                </VStack>
            </FormControl>
        </Container>
    );
}

export default AuthForm;