import { Image, HStack, Button, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import "../stylesheets/MainPageContent.css";

const logoUrl: string = "http://swarm.cs.pub.ro/~razvan/logos/acs-logos/acs-logo-image-only.png";
const apiKey: string = "8Yw+ruu9wB8ap66ZXITCYw==NOMTsMb0Gt7DQjto";
const apiUrl: string = `https://api.api-ninjas.com/v1/quotes?category=success`;
const headerObject = {
    headers: {
        'X-Api-Key': apiKey,
    },
}

const MainPageContent: React.FC = () => {
    const [quote, setQuote] = useState<string>("");

    useEffect(() => {
        fetch(apiUrl, headerObject).then(res => res.json()).then(data => {
            setQuote(data[0].quote)
        }).catch(err => console.error(err));
        return () => {}
    }, []);

    return (
        <VStack alignItems="center" justifyContent="center" height='100vh' spacing={10}>
            <HStack spacing={10} className="text">
                <Image boxSize='20vh' src={logoUrl} alt="logo"/>‘
                <VStack spacing={3}>
                    <Text fontSize='2.5vh' noOfLines={[1, 2, 3]} className="text-italic">Secretariat acs.pub.ro</Text>
                    <Button variant="solid" colorScheme="facebook">Autentificare</Button>
                </VStack>
            </HStack>
            <Text fontSize='3vh' noOfLines={[1, 2, 3]} className="text-italic">{quote}</Text>
        </VStack>
    );
}

export default MainPageContent;