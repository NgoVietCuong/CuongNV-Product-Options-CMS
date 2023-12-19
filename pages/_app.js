import "@/styles/globals.css";
import "@shopify/polaris/build/esm/styles.css";
import en from "@shopify/polaris/locales/en.json";
import { useRouter } from "next/router";
import { useState, useCallback, useEffect } from 'react';
import {
  AppProvider,
  LegacyCard,
  Frame,
  Layout,
  Loading,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  VerticalStack,
  TextContainer
} from '@shopify/polaris';
import { ChakraProvider } from "@chakra-ui/react";
import CustomTopBar from "@/components/Layout/TopBar";
import NavigationBar from "@/components/Layout/NavigationBar";

export default function App({ Component, pageProps }) {
  const router = useRouter();
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

  useEffect(() => {
    router.events.on("routeChangeStart", toggleIsLoading);
    router.events.on("routeChangeComplete", toggleIsLoading);

    return () => {
      router.events.off("routeChangeStart", toggleIsLoading);
      router.events.off("routeChangeComplete", toggleIsLoading);
    }
  }, [isLoading]);
  
  const loadingMarkup = isLoading ? <Loading /> : null;
  
  const loadingPageMarkup = (
    <SkeletonPage>
      <Layout>
        <Layout.Section>
          <LegacyCard sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={6} />
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
         <Frame
          logo={logo}
          topBar={<CustomTopBar toggleMobileNavigationActive={toggleMobileNavigationActive} />}
          navigation={<NavigationBar />}
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