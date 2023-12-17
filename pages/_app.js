import "@/styles/globals.css";
import "@shopify/polaris/build/esm/styles.css";
import en from "@shopify/polaris/locales/en.json";
import { useColorModeValue, Box, useDisclosure } from "@chakra-ui/react";
import { AppProvider } from "@shopify/polaris";
import { ChakraProvider } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import SideBar from "@/components/Layout/SideBar";
import TopBar from "@/components/Layout/TopBar";
import theme from '@/theme';
import '@fontsource/inter/latin-300.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  const { onOpen } = useDisclosure();
  return (
    <div className={inter.className}>
      <AppProvider i18n={en}>
        <ChakraProvider theme={theme}>
          <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
            <SideBar />
            <TopBar onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
              <Component {...pageProps} />
            </Box>
          </Box>
        </ChakraProvider>
      </AppProvider>
    </div>
  );
}