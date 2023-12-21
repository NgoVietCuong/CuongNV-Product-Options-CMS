import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Filters,
  Page,
  LegacyCard,
  ResourceList,
  ResourceItem,
  Text,
  Badge,
  VerticalStack
} from "@shopify/polaris";
import { Button, Grid, GridItem } from "@chakra-ui/react";
import parseCookies from "@/utils/parseCookies";

export default function OptionSets() {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortValue, setSortValue] = useState("DATE_MODIFIED_DESC");
  const [queryValue, setQueryValue] = useState(undefined);

  const handleQueryValueChange = useCallback(
    (value) => setQueryValue(value),
    []
  );

  const handleQueryValueRemove = useCallback(
    () => setQueryValue(undefined),
    []
  );
  
  const handleClearAll = useCallback(() => {
    handleQueryValueRemove();
  }, [handleQueryValueRemove]);

  const resourceName = {
    singular: "option set",
    plural: "option sets",
  };

  const items = [
    {
      id: "1",
      url: "/option-sets/1",
      name: "Option set 1",
      location: "Decatur, USA",
      latestOrderUrl: "orders/1456",
    },
    {
      id: "2",
      url: "/option-sets/2",
      name: "Option set 2",
      location: "Los Angeles, USA",
      latestOrderUrl: "orders/1457",
    },
  ];

  const bulkActions = [
    {
      content: "Enable Option Sets",
      onAction: () => console.log("Enable Option Sets"),
    },
    {
      content: "Disable Option Sets",
      onAction: () => console.log("Disable Option Sets"),
    },
    {
      content: "Duplicate Option Sets",
      onAction: () => console.log("Duplicat Option Sets"),
    },
    {
      content: "Delete Option Sets",
      onAction: () => console.log("Delete Option Sets"),
    },
  ];

  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={[]}
      onQueryChange={handleQueryValueChange}
      onQueryClear={handleQueryValueRemove}
      onClearAll={handleClearAll}
    >
      {/* <div style={{ paddingLeft: "8px" }}>
        <Button size="sm" h="34px" variant="outline" colorScheme="gray" onClick={() => router.push("/option-sets/create")}>
          Search
        </Button>
      </div> */}
    </Filters>
  );

  function renderItem(item) {
    const { id, url, name } = item;
    return (
      <ResourceItem
        id={id}
        url={url}
        accessibilityLabel={`View details for ${name}`}
        persistActions
      >
        <Grid w="100%" gridTemplateColumns="1fr 0.7fr 1.1fr 1.1fr 0.6fr" alignItems='center'>
          <GridItem>
            <Text variant="bodyMd" fontWeight="bold" as="h3">
              {name}
            </Text>
          </GridItem>
          <GridItem>
            <Badge status="info" progress="complete">Enable</Badge>
          </GridItem>
          <GridItem>
            <VerticalStack gap="1px">
              <Text variant="bodySm" as="h6" color="subdued">
                Created at
              </Text>
              <Text variant="bodyMd" as="h6">
                20/10/2023, 11:32:43 PM
              </Text>
            </VerticalStack>
          </GridItem>
          <GridItem>
            <VerticalStack>
              <Text variant="bodySm" as="h6" color="subdued">
                Updated at
              </Text>
              <Text variant="bodyMd" as="h6">
                20/10/2023, 11:32:43 PM
              </Text>
            </VerticalStack>
          </GridItem>
          <GridItem>
            <Text variant="bodySm" as="h6" color="subdued">
              Apply to
            </Text>
            <Text variant="bodyMd" as="h6">
              All products
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
      <LegacyCard>
        <ResourceList
          resourceName={resourceName}
          items={items}
          renderItem={renderItem}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          bulkActions={bulkActions}
          sortValue={sortValue}
          sortOptions={[
            { label: "Newest updated", value: "DATE_MODIFIED_DESC" },
            { label: "Oldest updated", value: "DATE_MODIFIED_ASC" },
          ]}
          onSortChange={(selected) => {
            setSortValue(selected);
            console.log(`Sort option changed to ${selected}.`);
          }}
          filterControl={filterControl}
        />
      </LegacyCard>
    </Page>
  );
}