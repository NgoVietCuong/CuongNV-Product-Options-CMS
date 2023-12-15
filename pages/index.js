import { Page, LegacyCard, Layout, FormLayout } from "@shopify/polaris";
import { Text, Button } from "@chakra-ui/react";
import { Switch, IconButton } from "@chakra-ui/react";
import { IoIosListBox, IoMdPricetags, IoMdCart } from "react-icons/io";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";

export default function Home({ jwt, shopId, initialConfig }) {
  const router = useRouter();
  const [configs, setConfigs] = useState(initialConfig);

  const handleConfigChange = async (configName) => {
    const newConfigs = {...configs, [configName]: !configs[configName]}
    setConfigs(newConfigs);

    await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configs`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      },
      data: {
        shopId: shopId,
        config: newConfigs
      }
    });
  }

  return (
    <Page title="Dashboard">
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
                  <Text fontWeight="500">Option set for product</Text>
                </div>
                <Switch size="md" isChecked={configs.appStatus} onChange={() => handleConfigChange('appStatus')} />
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
                  <Text fontWeight="medium">In-cart Editing</Text>
                </div>
                <Switch size="md" colorScheme="teal" isChecked={configs.editInCart} onChange={() => handleConfigChange('editInCart')} />
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
                  <Text fontWeight="medium">Price Add-ons</Text>
                </div>
                <Switch size="md" colorScheme="linkedin" isChecked={configs.priceAddOns} onChange={() => handleConfigChange('priceAddOns')} />
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
    </Page>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const jwt = req.cookies.jwtToken;
  const shopId = req.cookies.shopId;

  if (!jwt) {
    res.writeHead(301, { Location: "/login.html" });
    res.end();
  } 

  let initialConfig = {
    appStatus: false,
    editInCart: false,
    priceAddOns: false
  }

  const configRes = await axios({
    url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configs`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`
    }
  });

  const configData = configRes.data;
  if (configRes && configData.statusCode === 200) {
    initialConfig = {
      appStatus: configData.payload.appStatus,
      editInCart: configData.payload.editInCart,
      priceAddOns: configData.payload.priceAddOns
    }
  }

  return {
    props: {
      jwt,
      shopId,
      initialConfig
    }
  }
}