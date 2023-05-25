import { Alert, AlertIcon } from "@chakra-ui/react";
import { FadeInAnimation } from "../animations/FadeInAnimation";

interface GenericAlertProps {
    type: "success" | "error" | "info" | "warning"
    message: string
}

export const GenericAlert: React.FC<GenericAlertProps> = (props) => {
    return (
        <FadeInAnimation duration={0.5}>
            {/* @ts-ignore */}
            <Alert
                status={props.type}
                variant="left-accent"
                position="absolute"
                right={50}
                top={100}
                w="20vw"
                borderRadius="10px"
            >
                <AlertIcon />
                {props.message}
            </Alert>
        </FadeInAnimation>
    );
}