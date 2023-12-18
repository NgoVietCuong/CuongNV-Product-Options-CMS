import {
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
import { FiHome, FiArchive } from "react-icons/fi";
import { useRouter } from "next/router";

export default function SideBar() {
  const router = useRouter();
  const { isOpen, onClose } = useDisclosure();

  const LinkItems = [
    { name: "Dashboard", href: "/", icon: FiHome },
    { name: "Option Sets", href: "/option-sets", icon: FiArchive }
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
          bg={isSelected(href) ? "blue.50!important" : undefined}
          color={isSelected(href) ? "blue.600" : "#353535"}
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
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
        marginTop="56px"
        pt="20px"
        bg="white"
      >
        {LinkItems.map((link) => (
          <NavItem key={link.name} href={link.href} icon={link.icon}>
            <Text fontSize="14px" fontWeight="500" color={isSelected(link.href) ? "blue.600" : "#353535"}>{link.name}</Text>
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