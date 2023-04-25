import React from "react";

import {
    Card,
    Flex,
    StatLabel,
    Stat,
    StatNumber,
    Icon,
    Box
} from "@chakra-ui/react";

import { IconType } from "react-icons";

interface DataCardProps {
    labelStat: string,
    labelData: number | string,
    icon: IconType
}

export const DataCard: React.FC<DataCardProps> = (props: DataCardProps) => {
    return (
        // @ts-ignore
        <Card minH='100px' minW='200px'>
            <Flex direction='column' mt={6} ml={3.5}>
                <Flex
                    flexDirection='row'
                    align='center'
                    justify='center'
                    w='100%'
                    mb='25px'>
                    <Stat me='auto'>
                        <StatLabel
                            fontSize='xs'
                            color='gray.400'
                            fontWeight='bold'
                            textTransform='uppercase'>
                            {props.labelStat}
                        </StatLabel>
                        <Flex>
                            <StatNumber fontSize='lg' fontWeight='bold'>
                                {props.labelData}
                            </StatNumber>
                        </Flex>
                    </Stat>
                    <Box
                        borderRadius='50%'
                        h={"45px"}
                        w={"45px"}>
                        <Icon as={props.icon} />
                    </Box>
                </Flex>
            </Flex>
        </Card>
    );
};
