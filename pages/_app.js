import "@/styles/globals.css";
import "@shopify/polaris/build/esm/styles.css";
import en from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import { ChakraProvider } from "@chakra-ui/react";
import { FiHome, FiArchive } from "react-icons/fi";
// import SideBar from "@/components/Layout/SideBar";
// import TopBar from "@/components/Layout/TopBar";
import {
  LegacyCard,
  Frame,
  Layout,
  Loading,
  Navigation,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
  TopBar,
} from '@shopify/polaris';
import {useState, useCallback, useRef} from 'react';



export default function App({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive,
      ),
    [],
  );

  const toggleIsLoading = useCallback(
    () => setIsLoading((isLoading) => !isLoading),
    [],
  );
  
  const userMenuMarkup = (
    <TopBar.UserMenu
      name="Test CuongNV DA"
      initials="TC"
    />
  );
  
  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );
  
  const navigationMarkup = (
    <Navigation location="/">
      <Navigation.Section
        items={[
          {
            label: 'Dashboard',
            icon: FiHome,
            onClick: toggleIsLoading,
          },
          {
            label: 'Option sets',
            icon: FiArchive,
            onClick: toggleIsLoading,
          },
        ]}
      />
    </Navigation>
  );
  
  const loadingMarkup = isLoading ? <Loading /> : null;
  
  const loadingPageMarkup = (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={9} />
            </TextContainer>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
  
  const pageMarkup = isLoading ? loadingPageMarkup : <Component {...pageProps} />;
  
  const logo = {
    width: 86,
    topBarSource:
      'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
    contextualSaveBarSource:
      'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
    accessibilityLabel: 'Shopify',
  };
  return (
    <ChakraProvider>
      <AppProvider i18n={en}>
        {/* <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
          <SideBar />
          <TopBar onOpen={onOpen} />
          <Box ml={{ base: 0, md: 60 }} p="4">
            <Component {...pageProps} />
          </Box>
        </Box> */}
         <Frame
          logo={logo}
          topBar={topBarMarkup}
          navigation={navigationMarkup}
          showMobileNavigation={mobileNavigationActive}
          onNavigationDismiss={toggleMobileNavigationActive}
        >
          {loadingMarkup}
          {pageMarkup}
        </Frame>
      </AppProvider>
    </ChakraProvider>
  );
}