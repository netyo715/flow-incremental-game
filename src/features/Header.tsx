import { HStack, Heading, Tag } from "@yamada-ui/react";
import { GAME_VERSION, IS_BETA_VERSION } from "../define";

export const Header: React.FC = () => {
  return (
    <HStack px="md">
      <Heading>FlowIncrementalGame</Heading>
      <Tag>{GAME_VERSION}</Tag>
      {IS_BETA_VERSION ? <Tag>beta</Tag> : ""}
    </HStack>
  );
};
