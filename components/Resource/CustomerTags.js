import { useState, useCallback, useContext } from "react";
import { EmptyState, Tag, Modal, TextField, ResourceList, ResourceItem, Text, HorizontalStack, Scrollable } from "@shopify/polaris";
import { Box, Button } from "@chakra-ui/react";
import OptionSetContext from "@/context/OptionSetContext";

export default function CustomerTagResource() {
  const { initialCustomerTags, customerTags, setCustomerTags, setIsDirty } = useContext(OptionSetContext);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [searchTags, setSearchTags] = useState(initialCustomerTags);
  const [selectedTags, setSelectedTags] = useState([]);

  const resourceName = {
    singular: "customer tag",
    plural: "customer tags"
  }

  const emptyState = !searchTags.length ? (
    <Box className="po_resource_empty_state">
      <EmptyState
        image="https://cdn.shopify.com/shopifycloud/web/assets/v1/d468e94aa7318e7e.svg"
      >
        <Text variant="bodyMd" fontWeight="medium" as="h2">Can't find customer tags</Text>
      </EmptyState>
    </Box>
  ) : undefined;

  const handleValueChange = useCallback(
    (value) => {
      setValue(value);
      const newSearchTags = initialCustomerTags.filter(tag => tag.id.toLowerCase().includes(value.toLowerCase()));
      setSearchTags(newSearchTags);
    }, [searchTags]
  );

  const handleToggleModal = useCallback(() => setOpen((open) => !open), []);

  const handleCancelSelect = useCallback(
    () => {
      setValue("");
      setOpen(false);
      setSelectedTags(customerTags);
      setSearchTags(initialCustomerTags);
    }, [selectedTags]
  );

  const handleSelectTags = useCallback(
    () => {
      setValue("");
      setOpen(false);
      setIsDirty(true);
      setCustomerTags(selectedTags);
      setSearchTags(initialCustomerTags);
    }, [selectedTags]
  );

  const handleRemoveTag = useCallback(
    (tag) => {
      const newSelectedTags = [...selectedTags];
      const index = newSelectedTags.indexOf(tag);
      newSelectedTags.splice(index, 1);
      setIsDirty(true);
      setSelectedTags(newSelectedTags);
      setCustomerTags(newSelectedTags);
    }, [selectedTags]
  );

  function renderItem(item, id) {
    return (
      <ResourceItem id={id} key={id}>
        <Text variant="bodyMd" as="span">{id}</Text>
      </ResourceItem>
    )
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleCancelSelect}
        title="Select product tags"
        primaryAction={{
          content: "Select",
          onAction: handleSelectTags
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleCancelSelect,
          },
        ]}
      >
        <Modal.Section>
          <TextField
            value={value}
            placeholder="Search tags"
            onChange={handleValueChange}
          />
          <ResourceList
            resourceName={resourceName}
            emptyState={emptyState}
            items={searchTags}
            renderItem={renderItem}
            selectedItems={selectedTags}
            onSelectionChange={setSelectedTags}
            selectable
          />
        </Modal.Section>
      </Modal>
      <Button
        size="md"
        fontSize="xs"
        borderColor="#353535"
        color="#353535"
        height="34px"
        onClick={handleToggleModal}
      >Browse customer tags</Button>
      <HorizontalStack gap="3">
        {
          customerTags.map(tag => (
            <Tag onRemove={() => handleRemoveTag(tag)}>{tag}</Tag>
          ))
        }
      </HorizontalStack>
    </>
  )
}