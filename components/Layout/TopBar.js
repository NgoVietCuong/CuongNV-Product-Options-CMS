import {
  useColorModeValue,
  Text,
  IconButton,
  Avatar,
  Flex,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { FiMenu, FiChevronDown } from "react-icons/fi";

export default function TopBar({ onOpen, ...rest }) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="56px"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Flex alignItems={"center"}>
          <HStack>
            <Avatar
              bg="blue.500"
              color="white"
              size={"sm"}
              name={"Ngo Cuong"}
            />
            <VStack
              display={{ base: "none", md: "flex" }}
              alignItems="flex-start"
              spacing="1px"
              ml="2"
            >
              <Text fontSize="sm">Ngo Cuong</Text>
            </VStack>
          </HStack>
        </Flex>
      </HStack>
    </Flex>
  );
}