import { useState, useCallback, useContext } from "react";
import { Banner, EmptyState, Modal, TextField, ResourceList, ResourceItem, Text, Thumbnail, HorizontalStack, Scrollable } from "@shopify/polaris";
import { Box, Button } from "@chakra-ui/react";
import { ImageMajor } from '@shopify/polaris-icons';
import OptionSetContext from "@/context/OptionSetContext";

export default function CollectionResource() {
  const { initialCollections, collections, setCollections, setIsDirty } = useContext(OptionSetContext);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [searchCollections, setSearchCollections] = useState(initialCollections);
  const [selectedCollections, setSelectedCollections] = useState([]);

  const resourceName = {
    singular: "collection",
    plural: "collections"
  }

  const emptyState = !searchCollections.length ? (
    <Box className="po_resource_empty_state">
      <EmptyState
        image="https://cdn.shopify.com/shopifycloud/web/assets/v1/0c8a43219c5c1a08.svg"
      >
        <Text variant="bodyMd" fontWeight="medium" as="h2">Can't find collections</Text>
      </EmptyState>
    </Box>
  ) : undefined;

  const handleValueChange = useCallback(
    (value) => {
      setValue(value);
      const newSearchCollections = initialCollections.filter(collection => collection.title.toLowerCase().includes(value.toLowerCase()));
      setSearchCollections(newSearchCollections);
    }, [searchCollections]
  );

  const handleToggleModal = useCallback(() => setOpen((open) => !open), []);

  const handleCancelSelect = useCallback(
    () => {
      setValue("");
      setOpen(false);
      setSelectedCollections(collections);
      setSearchCollections(initialCollections);
    }, [selectedCollections]
  );

  const handleSelectCollections = useCallback(
    () => {
      setValue("");
      setOpen(false);
      setIsDirty(true);
      setCollections(selectedCollections);
      setSearchCollections(initialCollections);
    }, [selectedCollections]
  );

  const handleDismissCollections = useCallback(
    (item) => {
      const newSelectedCollections = [...selectedCollections];
      const index = newSelectedCollections.indexOf(item);
      newSelectedCollections.splice(index, 1);
      setIsDirty(true);
      setCollections(newSelectedCollections);
      setSelectedCollections(newSelectedCollections);
    }, [selectedCollections]
  )

  function renderSelectedCollections(items) {
    return (
      items.map(item => {
        const itemData = initialCollections.find(collection => collection.id === item);
        return (
          <Banner status="info" onDismiss={() => handleDismissCollections(item)}>
            <HorizontalStack blockAlign="center" gap="4">
              <Thumbnail source={itemData.image ? itemData.image.url : ImageMajor} size="small" />
              <Text variant="bodyMd" as="span">{itemData.title}</Text>
            </HorizontalStack>
          </Banner>
        )
      })
    )
  }

  function renderItem(item, id) {
    const {title, image} = item;
    return(
      <ResourceItem id={id} key={id}>
        <HorizontalStack blockAlign="center" gap="4">
          <Thumbnail source={image ? image.url : ImageMajor} size="small" />
          <Text variant="bodyMd" as="span">{title}</Text>
        </HorizontalStack>
      </ResourceItem>
    )
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleCancelSelect}
        title="Select collections"
        primaryAction={{
          content: "Select",
          onAction: handleSelectCollections
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
            placeholder="Search collections"
            onChange={handleValueChange} 
          />
          <ResourceList
            resourceName={resourceName}
            emptyState={emptyState}
            items={searchCollections}
            renderItem={renderItem}
            selectedItems={selectedCollections}
            onSelectionChange={setSelectedCollections}
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
      >Browse collections</Button>
      {collections.length > 4 ? (
        <Scrollable style={{height: '230px'}} horizontal={false} focusable>
          <Box className="po_banner_with_image">
            {renderSelectedCollections(collections)}
          </Box>
        </Scrollable>      
      ) : (
        <Box className="po_banner_with_image">
          {renderSelectedCollections(collections)}
        </Box>
      )}
    </>
  )
}