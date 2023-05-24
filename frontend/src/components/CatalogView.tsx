import {
    VStack,
    Tabs,
    Tab,
    TabList,
    TabPanels
} from "@chakra-ui/react";
import { SubjectsTab } from "./SubjectsTab";
import { MarksTab } from "./MarksTab";
import { useContext } from "react";
import { SecretaryContext } from "./AuthProvider";

export const CatalogView: React.FC = () => {
    const secretary = useContext(SecretaryContext);

    return (
        // @ts-ignore
        <VStack>
            <Tabs
                isFitted
                w="100%"
                h="80vh"
                variant="enclosed-colored"
                bg="#fff"
                overflow={"scroll"}
            >
                <TabList>
                    <Tab>Note</Tab>
                    <Tab>Materii</Tab>
                </TabList>
                <TabPanels>
                    <MarksTab year={secretary === null ? 0 : secretary.year_resp}/>
                    <SubjectsTab year={secretary === null ? 0 : secretary.year_resp}/>
                </TabPanels>
            </Tabs>
        </VStack>
    );
}