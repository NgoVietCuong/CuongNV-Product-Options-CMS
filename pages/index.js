import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { fetchData, updateData } from "@/utils/axiosRequest";
import { Page, LegacyCard, Layout, FormLayout } from "@shopify/polaris";
import { Text, Button, Switch, IconButton, Spinner } from "@chakra-ui/react";
import { IoIosListBox, IoMdPricetags, IoMdCart } from "react-icons/io";
import parseCookies from "@/utils/parseCookies";

export default function Home() {
  const router = useRouter();
  const [jwt, setJwt] = useState(null);
  const [shopId, setShopId] = useState(null);

  useEffect(() => {
    const cookies = parseCookies(document.cookie);
    setJwt(cookies.jwtToken);
    setShopId(cookies.shopId);
  }, []);

  const { data, isLoading } = useSWR(
    (jwt && shopId) ? [`${process.env.NEXT_PUBLIC_SERVER_URL}/configs`, jwt] : null,
    fetchData,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );

  const handleConfigChange = async (configName) => {
    const { payload: { appStatus, editInCart, priceAddOns } } = data;
    const oldConfig = { appStatus, editInCart, priceAddOns };
    const config = {...oldConfig, [configName]: !oldConfig[configName]}
    mutate([`${process.env.NEXT_PUBLIC_SERVER_URL}/configs`, jwt], updateData([`${process.env.NEXT_PUBLIC_SERVER_URL}/configs`, jwt, { shopId: shopId, config: config }]), {
      optimisticData: { ...data, payload: config},
      populateCache: true,
      revalidate: false,
      rollbackOnError: true,
    })
  }

  return (
    <Page title="Dashboard">
      {isLoading ? (
        <Layout>
          <Spinner top="10px" color='blue.500' size='md' />
        </Layout>
      ) : (
        <Layout>
          <Layout.Section oneThird>
            <LegacyCard sectioned>
              <FormLayout>
                <div className={styles.po_info_card_header}>
                  <div className={styles.po_info_card_inner}>
                    <IconButton
                      size={"sm"}
                      bg="blue.50"
                      variant="outline"
                      colorScheme="blue"
                      aria-label="in-cart edit"
                      border="none"
                      icon={<IoIosListBox size="20px" />}
                    />
                    <Text fontWeight="500" fontSize="14px">Option set for product</Text>
                  </div>
                  {data && <Switch size="md" colorScheme="blue" isChecked={data.payload.appStatus} onChange={() => handleConfigChange("appStatus")} /> }
                </div>
                <Text fontSize="13px" fontWeight="400">
                  Store owners can create and apply option sets to multiple
                  products
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => router.push("/option-sets")}
                >
                  Manage Option Set
                </Button>
              </FormLayout>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section oneThird>
            <LegacyCard sectioned>
              <FormLayout>
                <div className={styles.po_info_card_header}>
                  <div className={styles.po_info_card_inner}>
                    <IconButton
                      size={"sm"}
                      bg="teal.50"
                      variant="outline"
                      colorScheme="teal"
                      aria-label="in-cart edit"
                      border="none"
                      icon={<IoMdCart size={"20px"} />}
                    />
                    <Text fontWeight="medium" fontSize="14px">In-cart Editing</Text>
                  </div>
                  {data && <Switch size="md" colorScheme="teal" isChecked={data.payload.editInCart} onChange={() => handleConfigChange("editInCart")} />}
                </div>
                <Text fontSize="13px" fontWeight="400">
                  Customers can edit the selected options on cart page
                </Text>
                <Button size="sm" variant="outline" colorScheme="teal">
                  Preview
                </Button>
              </FormLayout>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section oneThird>
            <LegacyCard sectioned>
              <FormLayout>
                <div className={styles.po_info_card_header}>
                  <div className={styles.po_info_card_inner}>
                    <IconButton
                      size={"sm"}
                      bg="cyan.50"
                      variant="outline"
                      colorScheme="linkedin"
                      aria-label="in-cart edit"
                      border="none"
                      icon={<IoMdPricetags size={"20px"} />}
                    />
                    <Text fontWeight="medium" fontSize="14px">Price Add-ons</Text>
                  </div>
                  {data && <Switch size="md" colorScheme="linkedin" isChecked={data.payload.priceAddOns} onChange={() => handleConfigChange("priceAddOns")} /> }
                </div>
                <Text fontSize="13px" fontWeight="400">
                  Store owner can charge customers additional fee when they select
                  options
                </Text>
                <Button size="sm" variant="outline" colorScheme="telegram">
                  Preview
                </Button>
              </FormLayout>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      )}
    </Page>
  );
}