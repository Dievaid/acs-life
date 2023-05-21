import {
    VStack,
    Tabs,
    Tab,
    TabList,
    TabPanels
} from "@chakra-ui/react";
import { SubjectsTab } from "./SubjectsTab";
import { MarksTab } from "./MarksTab";

export const CatalogView: React.FC = () => {
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
                    <MarksTab year={1}/>
                    <SubjectsTab year={1}/>
                </TabPanels>
            </Tabs>
        </VStack>
    );
}