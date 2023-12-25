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
import { Spinner, useToast } from "@chakra-ui/react";
import { fetchData, createData, updateData } from "@/utils/axiosRequest";
import { initialOption, initialOptionError } from "@/utils/constants";
import parseCookies from "@/utils/parseCookies";
import OptionSetContext from "@/context/OptionSetContext";
import CustomerForm from "@/components/Forms/CustomerForm";
import ProductForm from "@/components/Forms/ProductForm";
import OptionForm from "@/components/Forms/OptionForm";

export default function UpdateOptionSet() {
  const router = useRouter();
  const toast = useToast();

  const [jwt, setJwt] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [initialProducts, setInitialProducts] = useState([]);
  const [initialCollections, setInitialCollections] = useState([]);
  const [initialProductTags, setInitialProductTags] = useState([]);
  const [initialCustomers, setInitialCustomers] = useState([]);
  const [initialCustomerTags, setInitialCustomerTags] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("0");
  const [status, setStatus] = useState(true);
  const [applyToCustomer, setApplyToCustomer] = useState("0");
  const [customers, setCustomers] = useState([]);
  const [customerTags, setCustomerTags] = useState([]);
  const [applyToProduct, setApplyToProduct] = useState("00");
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const [options, setOptions] = useState([{...initialOption}]);
  const [activeError, setActiveError] = useState(false);
  const [optionErrors, setOptionErrors] = useState([{...initialOptionError}]);
  
  const fetchInitialData = useCallback(async () => {
    if (jwt && shopId) {
      setIsFetching(true);
      const productRes = await fetchData([`${process.env.NEXT_PUBLIC_SERVER_URL}/products/list`, jwt]);
      const [collectionRes, productTagRes, customerRes, customerTagRes] = await Promise.all([
        fetchData([`${process.env.NEXT_PUBLIC_SERVER_URL}/products/collections`, jwt]),
        fetchData([`${process.env.NEXT_PUBLIC_SERVER_URL}/products/tags`, jwt]),
        fetchData([`${process.env.NEXT_PUBLIC_SERVER_URL}/customers/list`, jwt]),
        fetchData([`${process.env.NEXT_PUBLIC_SERVER_URL}/customers/tags`, jwt])
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

  const statusOptions = [
    { label: "Enable", value: true },
    { label: "Disabled", value: false },
  ];

  const handleNameChange =(newName) => {
    setName(newName);
    setIsDirty(true);
  }

  const handlePriorityChange = (newPriority) => {
    setPriority(newPriority);
    setIsDirty(true);
  }

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setIsDirty(true);
  }

  const handleSaveOptionSet = async () => {
    let errorFields = 0;
    if (!name.trim()) {
      errorFields += 1;
    }

    if (!priority.trim()) {
      errorFields += 1;
    }

    options.forEach((option, index) => {
      errorFields += optionErrors[index].label;
      if (option.type === "2") {
        errorFields += optionErrors[index].dropdownMenu.filter(error => error).length;
      } else if (option.type === "3") {
        errorFields += optionErrors[index].checkbox.filter(error => error).length;
      } else if (option.type === "4") {
        errorFields += optionErrors[index].radioButton.filter(error => error).length;
      } else if (option.type === "6") {
        errorFields += optionErrors[index].button.filter(error => error).length;
      }
    });

    if (errorFields) {
      setActiveError(true);
      toast({
        title: "Failed to save option set",
        description: `Please fill in ${errorFields} required fields to save successfully`,
        status: "error",
        isClosable: true,
        duration: 2000
      });
      return;
    }

    setActiveError(false);
    setIsSaving(true);

    const optionData = options.map(option => {
      return {
        ...option,
        type: parseInt(option.type),
        textBox: { priceAddOn: parseFloat(option.textBox.priceAddOn)},
        numberField: { priceAddOn: parseFloat(option.numberField.priceAddOn) },
        dropdownMenu: option.dropdownMenu.map(detail => { return {...detail, priceAddOn: parseFloat(detail.priceAddOn)}}),
        checkbox: option.checkbox.map(detail => { return {...detail, priceAddOn: parseFloat(detail.priceAddOn)}}),
        radioButton: option.radioButton.map(detail => { return {...detail, priceAddOn: parseFloat(detail.priceAddOn)}}),
        button: option.button.map(detail => { return {...detail, priceAddOn: parseFloat(detail.priceAddOn)}}),
      }
    });

    const data = {
      shopId: shopId,
      name: name,
      priority: parseInt(priority),
      status: status,
      applyToCustomer: parseInt(applyToCustomer),
      customerIds: customers.map(customer => parseInt(customer)),
      customerTags: customerTags,
      applyToProduct: parseInt(applyToProduct),
      productIds: products.map(product => parseInt(product)),
      productCollections: collections.map(collection => parseInt(collection)),
      productTags: productTags,
      options: optionData
    }

    const saveOptionSet = await createData([`${process.env.NEXT_PUBLIC_SERVER_URL}/option-sets`, jwt, data]);
    setIsSaving(false);

    if (saveOptionSet && saveOptionSet.statusCode === 201) {
      router.push("/option-sets");
    }
  }

  const handleDiscardChange = () => {
    router.push("/option-sets");
  }

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
                onAction: handleSaveOptionSet,
                loading: isSaving,
                disabled: isSaving,
              }}
              discardAction={{
                onAction: handleDiscardChange,
              }}
            />}
            <FormLayout>
              <TextField
                label="Option set name"
                value={name}
                onChange={handleNameChange}
                autoComplete="off"
                error={(!name.trim() && activeError) && "Store name is required"}
              />
              <TextField
                label="Priority"
                type="number"
                value={priority}
                onChange={handlePriorityChange}
                helpText="0 is the highest priority. When there are two Option Sets set for the same products/customers, the one with higher priority will be applied."
                autoComplete="off"
                error={(!priority.trim() && activeError) && "Priority is required"}
              />
              <Select
                label="Status"
                options={statusOptions}
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
            options, setOptions,
            optionErrors, setOptionErrors,
            activeError, setIsDirty,
            initialProducts, initialCollections,
            initialProductTags, initialCustomers, 
            initialCustomerTags,
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