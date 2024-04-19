import { VStack } from "@yamada-ui/react";
import { Header } from "./features/Header";
import { MainContent } from "./features/MainContent";

export const App: React.FC = () => {
  return (
    <VStack gap="0" h="100vh">
      <Header />
      <MainContent />
    </VStack>
  );
};
