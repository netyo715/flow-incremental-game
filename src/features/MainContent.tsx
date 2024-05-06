import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@yamada-ui/react";
import { Achievements } from "./TabContents/Achievements";
import { Settings } from "./TabContents/Settings";
import { Factory } from "./TabContents/Factory";
import { Resources } from "./TabContents/Resources";
import { Upgrades } from "./TabContents/Upgrades";

export const MainContent: React.FC = () => {
  return (
    <Tabs flexGrow="1">
      <TabList px="md">
        <Tab>工場</Tab>
        <Tab>強化</Tab>
        <Tab>資源</Tab>
        <Tab>実績</Tab>
        <Tab>設定</Tab>
      </TabList>
      <TabPanels flexGrow="1">
        <TabPanel h="100%" p="0">
          <Factory />
        </TabPanel>
        <TabPanel h="100%" p="0">
          <Upgrades />
        </TabPanel>
        <TabPanel h="100%" p="0">
          <Resources />
        </TabPanel>
        <TabPanel h="100%" p="0">
          <Achievements />
        </TabPanel>
        <TabPanel h="100%" p="0">
          <Settings />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
