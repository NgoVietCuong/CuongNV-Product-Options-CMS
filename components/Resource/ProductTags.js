import { useState, useCallback, useContext } from "react";
import { EmptyState, Tag, Modal, TextField, ResourceList, ResourceItem, Text, HorizontalStack, Scrollable } from "@shopify/polaris";
import { Button } from "@chakra-ui/react";
import OptionSetContext from "@/context/OptionSetContext";

export default function ProductTagResource() {
  const { initialProductTags, productTags, setProductTags, setIsDirty } = useContext(OptionSetContext);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [searchTags, setSearchTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  console.log('searchTags', productTags);
  console.log('selectedTags', selectedTags)

  const resourceName = {
    singular: "product tag",
    plural: "product tags"
  }

  const emptyState = !searchTags.length ? (
    <div className="po_resource_empty_state">
      <EmptyState
        image="https://cdn.shopify.com/shopifycloud/web/assets/v1/67d1bd2ad29c4adc.svg"
      >
        <Text variant="bodyMd" fontWeight="medium" as="h2">Can't find product tags</Text>
      </EmptyState>
    </div>
  ) : undefined;

  const handleValueChange = useCallback(
    (value) => {
      setValue(value);
      const newSearchTags = initialProductTags.filter(tag => tag.title.toLowerCase().includes(value.toLowerCase()));
      setSearchTags(newSearchTags);
    }, [searchTags]
  );

  const handleToggleModal = useCallback(() => setOpen((open) => !open), []);

  const handleSelectTags = useCallback(
    () => {
      setProductTags(selectedTags);
      setOpen(false);
      setIsDirty(true);
    }, [selectedTags]
  );

  const handleRemoveTag = useCallback(
    (tag) => {
      const newSelectedTags = [...selectedTags];
      const index = newSelectedTags.indexOf(tag);
      newSelectedTags.splice(index, 1);
      setSelectedTags(newSelectedTags);
      setProductTags(newSelectedTags);
      setIsDirty(true);
    }, [selectedTags]
  )

  function renderItem(item) {
    return(
      <ResourceItem id={item}>
        <Text variant="bodyMd" as="span">{item}</Text>
      </ResourceItem>
    )
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleToggleModal}
        title="Select product tags"
        primaryAction={{
          content: "Select",
          onAction: handleSelectTags
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleToggleModal,
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
      >Browse product tags</Button>
      <HorizontalStack gap="3">
        {
          productTags.map(tag => (
            <Tag onRemove={() => handleRemoveTag(tag)}>{tag}</Tag>
          ))
        }
      </HorizontalStack>
    </>
  )
}