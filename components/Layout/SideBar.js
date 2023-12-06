import {
  CloseButton,
  Box,
  useColorModeValue,
  Flex,
  Text,
  Icon,
  Drawer,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";
import { FiHome, FiArchive, FiSettings } from "react-icons/fi";
import { useRouter } from "next/router";

export default function SideBar() {
  const router = useRouter();
  const { isOpen, onClose } = useDisclosure();

  const LinkItems = [
    { name: "Dashboard", href: "/", icon: FiHome },
    { name: "Option Sets", href: "/option-sets", icon: FiArchive },
    { name: "Settings", href: "/settings", icon: FiSettings },
  ];

  const isSelected = (path) => {
    const isRoot = path === "/";
    if (isRoot) {
      return router.pathname === path;
    } else {
      return router.pathname.includes(path);
    }
  };

  const NavItem = ({ icon, href, children }) => {
    return (
      <Link
        as={NextLink}
        href={href}
        style={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none" }}
      >
        <Flex
          align="center"
          p="3"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "gray.100",
          }}
          bg={isSelected(href) ? "blue.500!important" : undefined}
          color={isSelected(href) ? "white" : "#353535"}
        >
          {icon && <Icon mr="4" fontSize="16" as={icon} />}
          {children}
        </Flex>
      </Link>
    );
  };

  const SidebarContent = ({ onClose, ...rest }) => {
    return (
      <Box
        transition="3s ease"
        bg={useColorModeValue("white", "gray.900")}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex
          h="20"
          alignItems="center"
          mx="8"
          justifyContent="space-between"
          w="100%"
        >
          <Text fontSize="22px" fontWeight="600">
            Product Options
          </Text>
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.name} href={link.href} icon={link.icon}>
            {link.name}
          </NavItem>
        ))}
      </Box>
    );
  };

  return (
    <>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
    </>
  );
}