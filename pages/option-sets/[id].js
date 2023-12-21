import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Page,
  LegacyCard,
  Layout,
  TextField,
  Select,
  FormLayout,
  ContextualSaveBar
} from "@shopify/polaris";
import { Spinner } from "@chakra-ui/react";
import { fetchData } from "@/utils/axiosRequest";
import parseCookies from "@/utils/parseCookies";
import OptionSetContext from "@/context/OptionSetContext";
import CustomerForm from "@/components/Forms/CustomerForm";
import ProductForm from "@/components/Forms/ProductForm";
import OptionForm from "@/components/Forms/OptionForm";

export default function UpdateOptionSet() {
  const router = useRouter();

  const [jwt, setJwt] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [initialProducts, setInitialProducts] = useState([]);
  const [initialCollections, setInitialCollections] = useState([]);
  const [initialProductTags, setInitialProductTags] = useState([]);
  const [initialCustomers, setInitialCustomers] = useState([]);
  const [initialCustomerTags, setInitialCustomerTags] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("0");
  const [status, setStatus] = useState("Enable");
  const [applyToCustomer, setApplyToCustomer] = useState("0");
  const [customers, setCustomers] = useState([]);
  const [customerTags, setCustomerTags] = useState([]);
  const [applyToProduct, setApplyToProduct] = useState("00");
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [productTags, setProductTags] = useState([]);

  const fetchInitialData = useCallback(async () => {
    if (jwt && shopId) {
      setIsFetching(true);
      const fetchProducts = fetchData([`${process.env.NEXT_PUBLIC_SERVER_URL}/products/list`, jwt]);
      const fetchCollections = fetchData([`${process.env.NEXT_PUBLIC_SERVER_URL}/products/collections`, jwt]);
      const fetchProductTags = fetchData([`${process.env.NEXT_PUBLIC_SERVER_URL}/products/tags`, jwt]);
      const fetchCustomers = fetchData([`${process.env.NEXT_PUBLIC_SERVER_URL}/customers/list`, jwt]);
      const fetchCustomerTags = fetchData([`${process.env.NEXT_PUBLIC_SERVER_URL}/customers/tags`, jwt]);

      const [productRes, collectionRes, productTagRes, customerRes, customerTagRes] = await Promise.all([
        fetchProducts,
        fetchCollections,
        fetchProductTags,
        fetchCustomers,
        fetchCustomerTags
      ]);

      if (productRes && productRes.statusCode === 200) {
        setInitialProducts(productRes.payload);
      }

      if (collectionRes && collectionRes.statusCode === 200) {
        setInitialCollections(collectionRes.payload);
      }

      if (productTagRes && productTagRes.statusCode === 200) {
        setInitialProductTags(productTagRes.payload);
      }

      if (customerRes && customerRes.statusCode === 200) {
        setInitialCustomers(customerRes.payload);
      }

      if (customerTagRes && customerTagRes.statusCode === 200) {
        setInitialCustomerTags(customerTagRes.payload);
      }
      setIsFetching(false);
    }
  }, [jwt, shopId]);

  useEffect(() => {
    const cookies = parseCookies(document.cookie);
    setJwt(cookies.jwtToken);
    setShopId(cookies.shopId);
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const options = [
    { label: "Enable", value: "enable" },
    { label: "Disabled", value: "disable" },
  ];

  const handleNameChange = useCallback(
    (newName) => {
      setName(newName);
      setIsDirty(true);
    }, []
  );

  const handlePriorityChange = useCallback(
    (newPriority) => {
      setPriority(newPriority);
      setIsDirty(true);
    }, []
  );

  const handleStatusChange = useCallback(
    (newStatus) => {
      setStatus(newStatus);
      setIsDirty(true);
    },[]
  );

  return (
    <Page title="Create Option Set">
      {isFetching ? (
        <Layout>
          <Spinner top="10px" color='blue.500' size='md' />
        </Layout>
      ) : (
        <>
          <LegacyCard title="General Information" sectioned>
            {isDirty && <ContextualSaveBar
              message="Unsaved changes"
              saveAction={{
                onAction: () => console.log('add form submit logic'),
                loading: false,
                disabled: false,
              }}
              discardAction={{
                onAction: () => console.log('add clear form logic'),
              }}
            />}
            <FormLayout>
              <TextField
                label="Option set name"
                value={name}
                onChange={handleNameChange}
                autoComplete="off"
              />
              <TextField
                label="Priority"
                type="number"
                value={priority}
                onChange={handlePriorityChange}
                helpText="0 is the highest priority. When there are two Option Sets set for the same products/customers, the one with higher priority will be applied."
                autoComplete="off"
              />
              <Select
                label="Status"
                options={options}
                onChange={handleStatusChange}
                value={status}
              />
            </FormLayout>
          </LegacyCard>

          <OptionSetContext.Provider value={{
            applyToCustomer, setApplyToCustomer, 
            customers, setCustomers, 
            customerTags, setCustomerTags,
            applyToProduct, setApplyToProduct,
            products, setProducts,
            collections, setCollections,
            productTags, setProductTags,
            setIsDirty, initialProducts,
            initialCollections, initialProductTags,
            initialCustomers, initialCustomerTags,
          }}>
            <CustomerForm />
            <ProductForm />
            <OptionForm />
          </OptionSetContext.Provider>
        </>
      )}
    </Page>
  );
}