import { Divider, HStack, VStack } from "@yamada-ui/react";

export const Factory: React.FC = () => {
  return (
    <HStack h="100%">
      <VStack h="100%" minW="200px" maxW="25%"></VStack>
      <Divider orientation="vertical" />
      <VStack></VStack>
    </HStack>
  );
};
