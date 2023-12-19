import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import {
  Page,
  LegacyCard,
  TextField,
  Select,
  FormLayout,
  ContextualSaveBar
} from "@shopify/polaris";
import CustomerForm from "@/components/Forms/CustomerForm";
import ProductForm from "@/components/Forms/ProductForm";
import OptionCard from "@/components/Options/OptionCard";
import { fetchData } from "@/utils/axiosRequest";

export default function UpdateOptionSet({ jwt, shopId, products, collections, productTags, customers, customerTags }) {
  console.log('products', products);
  console.log('collections', collections);
  console.log('productTags', productTags);
  console.log('customers', customers);
  console.log('customerTags', customerTags);

  const [name, setName] = useState("");
  const [priority, setPriority] = useState("0");
  const [status, setStatus] = useState("Enable");
  const [isDirty, setIsDirty] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [applyToCustomer, setApplyToCustomer] = useState("0");
  const [customerIds, setCustomerIds] = useState([]);
  const [applyToProduct, setApplyToProduct] = useState("0");

  const options = [
    { label: "Enable", value: "enable" },
    { label: "Disabled", value: "disable" },
  ];

  const handleNameChange = useCallback(
    (newName) => setName(newName),
    []
  );

  const handlePriorityChange = useCallback(
    (newPriority) => setPriority(newPriority),
    []
  );

  const handleStatusChange = useCallback(
    (newStatus) => setStatus(newStatus),
    []
  );

  return (
    <Page title="Create Option Set">
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

      <CustomerForm />
      <ProductForm />
      <OptionCard />
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

  let products = [];
  let collections = [];
  let productTags = [];
  let customers = [];
  let customerTags = [];

  const fetchProducts = fetchData([`${process.env.SERVER_URL}/products/list`, jwt]);
  const fetchCollections = fetchData([`${process.env.SERVER_URL}/products/collections`, jwt]);
  const fetchProductTags = fetchData([`${process.env.SERVER_URL}/products/tags`, jwt]);
  const fetchCustomers = fetchData([`${process.env.SERVER_URL}/customers/list`, jwt]);
  const fetchCustomerTags = fetchData([`${process.env.SERVER_URL}/customers/tags`, jwt]);

  const [productRes, collectionRes, productTagRes, customerRes, customerTagRes] = await Promise.all([
    fetchProducts,
    fetchCollections,
    fetchProductTags,
    fetchCustomers,
    fetchCustomerTags
  ]);

  if (productRes && productRes.statusCode === 200) {
    products = productRes.payload;
  }

  if (collectionRes && collectionRes.statusCode === 200) {
    collections = collectionRes.payload;
  }

  if (productTagRes && productTagRes.statusCode === 200) {
    productTags = productTagRes.payload;
  }

  if (customerRes && customerRes.statusCode === 200) {
    customers = customerRes.payload;
  }

  if (customerTagRes && customerTagRes.statusCode === 200) {
    customerTags = customerTagRes.payload;
  }

  return {
    props: {
      jwt,
      shopId,
      products,
      collections,
      productTags,
      customers,
      customerTags
    }
  }
}