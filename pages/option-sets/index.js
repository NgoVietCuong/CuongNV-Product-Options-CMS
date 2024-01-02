import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Filters,
  Page,
  LegacyCard,
  ResourceList,
  ResourceItem,
  Text,
  Badge,
  Layout,
  VerticalStack,
  EmptyState
} from "@shopify/polaris";
import { Box, Button, Grid, GridItem, Spinner} from "@chakra-ui/react";
import parseCookies from "@/utils/parseCookies";
import { fetchData, updateData } from "@/utils/axiosRequest";
import formatMongoDateTime from "@/utils/formatTime";

export default function OptionSets() {
  const router = useRouter();
  const [jwt, setJwt] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [optionSets, setOptionSets] = useState([]);
  const [searchOptionSets, setSearchOptionSets] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState("DATE_UPDATED_DESC");
  const [queryValue, setQueryValue] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const resourceName = {
    singular: "option set",
    plural: "option sets",
  };

  const emptyState = !optionSets.length ? (
    <Box>
      <EmptyState
        image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
      >
        <Text variant="bodyMd" fontWeight="medium" as="h2">Create a new option set to get started</Text>
      </EmptyState>
    </Box>
  ) : undefined;

  useEffect(() => {
    const cookies = parseCookies(document.cookie);
    setJwt(cookies.jwtToken);
    setShopId(cookies.shopId);
  }, []);

  const { data, isLoading } = useSWR(
    (jwt && shopId) ? [`${process.env.NEXT_PUBLIC_SERVER_URL}/option-sets`, jwt] : null,
    fetchData,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false
    }
  );

  useEffect(() => {
    setIsUpdating(false);
    if (data && data.statusCode === 200) {
      setOptionSets(data.payload.map(optionSet => { return {...optionSet, id: optionSet._id }}));
      setSearchOptionSets(data.payload.map(optionSet => { return {...optionSet, id: optionSet._id }}));
    }
  }, [data]);

  const handleQueryValueChange = (value) => {
    setQueryValue(value);
    const newSearchOptionSets = optionSets.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
    setSearchOptionSets(newSearchOptionSets);
  }

  const handleEnableOptionSets = async () => {
    setIsUpdating(true);
    setSelectedItems([]);
    await updateData([`${process.env.NEXT_PUBLIC_SERVER_URL}/option-sets`, jwt, { ids: selectedItems, status: true }]);
    mutate([`${process.env.NEXT_PUBLIC_SERVER_URL}/option-sets`, jwt]);
  }

  const handleDisableOptionSets = async () => {
    setIsUpdating(true);
    setSelectedItems([]);
    await updateData([`${process.env.NEXT_PUBLIC_SERVER_URL}/option-sets`, jwt, { ids: selectedItems, status: false }]);
    mutate([`${process.env.NEXT_PUBLIC_SERVER_URL}/option-sets`, jwt]);
  }

  const handleDeleteOptionSets = async () => {
    
  }

  const bulkActions = [
    {
      content: "Enable Option Sets",
      onAction: handleEnableOptionSets,
    },
    {
      content: "Disable Option Sets",
      onAction: handleDisableOptionSets,
    },
    {
      content: "Delete Option Sets",
      onAction: handleDeleteOptionSets,
    },
  ];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={[]}
      onQueryChange={handleQueryValueChange}
    >
    </Filters>
  );

  function renderItem(item, id) {
    const { name, status, applyToProduct, productIds, productCollections, productTags, createdAt, updatedAt } = item;
    let applyTo = "";

    if (applyToProduct === 0) {
      applyTo = "All products"
    } else if (applyToProduct === 1) {
      applyTo = productIds.length > 1 ? `${productIds.length} products` : `${productIds.length} product` 
    } else if (applyToProduct === 2) {
      applyTo = productCollections.length > 1 ? `${productCollections.length} collections` : `${productCollections.length} collection` 
    } else if (applyToProduct === 3) {
      applyTo = productTags.length > 1 ? `${productTags.length} tags` : `${productTags.length} tag` 
    }

    return (
      <ResourceItem
        id={id}
        key={id}
        onClick={() => router.push("/option-sets/[id]", `/option-sets/${id}`)}
        accessibilityLabel={`View details for ${name}`}
        // persistActions
      >
        <Grid w="100%" gridTemplateColumns="1fr 0.7fr 1.1fr 1.1fr 0.6fr" alignItems='center'>
          <GridItem>
            <Text variant="bodyMd" fontWeight="bold" as="h3">
              {name}
            </Text>
          </GridItem>
          <GridItem>
            <Badge status={status ? "info": "new"} progress={status ? "complete": "partiallyComplete"}>{status ? "Active" : "Inactive"}</Badge>
          </GridItem>
          <GridItem>
            <VerticalStack gap="1px">
              <Text variant="bodySm" as="h6" color="subdued">
                Created at
              </Text>
              <Text variant="bodyMd" as="h6">
                {formatMongoDateTime(createdAt)}
              </Text>
            </VerticalStack>
          </GridItem>
          <GridItem>
            <VerticalStack>
              <Text variant="bodySm" as="h6" color="subdued">
                Updated at
              </Text>
              <Text variant="bodyMd" as="h6">
              {formatMongoDateTime(updatedAt)}
              </Text>
            </VerticalStack>
          </GridItem>
          <GridItem>
            <Text variant="bodySm" as="h6" color="subdued">
              Apply to
            </Text>
            <Text variant="bodyMd" as="h6">
              {applyTo}
            </Text>
          </GridItem>
        </Grid>
      </ResourceItem>
    );
  }

  return (
    <Page
      title="Option Sets"
      primaryAction={
        <Button size="sm" h="34px" variant="solid" colorScheme="blue" onClick={() => router.push("/option-sets/create")}>
          Create option set
        </Button>
      }
    >
      {isLoading ? (
        <Layout>
          <Spinner top="10px" color='blue.500' size='md' />
        </Layout>
      ) : (
        <LegacyCard>
          <ResourceList
            resourceName={resourceName}
            emptyState={emptyState}
            items={searchOptionSets}
            renderItem={renderItem}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            bulkActions={bulkActions}
            loading={isUpdating}
            sortValue={sortValue}
            sortOptions={[
              { label: "Newest updated", value: "DATE_UPDATED_DESC" },
              { label: "Oldest updated", value: "DATE_UPDATED_ASC" },
            ]}
            onSortChange={(selected) => {
              setSortValue(selected);
              const newOptionSets = [...optionSets];
              const newSearchOptionSets = [...searchOptionSets];
              newOptionSets.sort((first, second) => {
                let firstDate = new Date(first.updatedAt);
                let secondDate = new Date(second.updatedAt);
                if (selected === "DATE_UPDATED_DESC") {
                  return secondDate - firstDate;
                } else {
                  return firstDate - secondDate;
                }
              });
              newSearchOptionSets.sort((first, second) => {
                let firstDate = new Date(first.updatedAt);
                let secondDate = new Date(second.updatedAt);
                if (selected === "DATE_UPDATED_DESC") {
                  return secondDate - firstDate;
                } else {
                  return firstDate - secondDate;
                }
              });
              setOptionSets(newOptionSets);
              setSearchOptionSets(newSearchOptionSets);
            }}
            filterControl={filterControl}
          />
        </LegacyCard>
      )}
    </Page>
  );
}