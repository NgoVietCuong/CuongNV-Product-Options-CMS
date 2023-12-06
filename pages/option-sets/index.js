import {
  Filters,
  Page,
  Button,
  LegacyCard,
  ResourceList,
  ResourceItem,
  Text,
} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useRouter } from "next/router";

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
      <div style={{ paddingLeft: "8px" }}>
        <Button onClick={() => router.push("/option-sets/create")}>
          Search
        </Button>
      </div>
    </Filters>
  );

  return (
    <Page
      title="Option Sets"
      primaryAction={
        <Button primary onClick={() => router.push("/option-sets/create")}>
          Create new option set
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
            { label: "Newest update", value: "DATE_MODIFIED_DESC" },
            { label: "Oldest update", value: "DATE_MODIFIED_ASC" },
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

  function renderItem(item) {
    const { id, url, name } = item;
    return (
      <ResourceItem
        id={id}
        url={url}
        accessibilityLabel={`View details for ${name}`}
        persistActions
      >
        <Text variant="bodyMd" fontWeight="bold" as="h3">
          {name}
        </Text>
      </ResourceItem>
    );
  }
}