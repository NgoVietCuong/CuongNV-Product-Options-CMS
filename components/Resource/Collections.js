import { useState, useCallback, useContext } from "react";
import { Banner, Modal, TextField, ResourceList, ResourceItem, Text, Thumbnail, HorizontalStack, Scrollable } from "@shopify/polaris";
import { Button } from "@chakra-ui/react";
import OptionSetContext from "@/context/OptionSetContext";

export default function CollectionResource() {
  const { initialCollections, collections, setCollections, setIsDirty } = useContext(OptionSetContext);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [searchCollections, setSearchCollections] = useState(initialCollections);
  const [selectedCollections, setSelectedCollections] = useState([]);

  console.log('collections', collections)

  const resourceName = {
    singular: "collection",
    plural: "collections"
  }

  const handleValueChange = useCallback(
    (value) => {
      setValue(value);
      const newSearchCollections = initialCollections.filter(collection => collection.title.toLowerCase().includes(value.toLowerCase()));
      setSearchCollections(newSearchCollections);
    }, [searchCollections]
  );

  const handleToggleModal = useCallback(() => setOpen((open) => !open), []);

  const handleSelectCollections = useCallback(
    () => {
      setCollections(selectedCollections);
      setOpen(false);
      setIsDirty(true);
    }, [selectedCollections]
  );

  const handleDismissCollections = useCallback(
    (item) => {
      const newSelectedCollections = [...selectedCollections];
      const index = newSelectedCollections.indexOf(item);
      newSelectedCollections.splice(index, 1);
      setSelectedCollections(newSelectedCollections);
      setCollections(newSelectedCollections);
      setIsDirty(true);
    }, [selectedCollections]
  )

  function renderSelectedCollections(items) {
    return (
      items.map(item => {
        const itemData = initialCollections.find(collection => collection.id === item);
        return (
          <Banner status="info" onDismiss={() => handleDismissCollections(item)}>
            <HorizontalStack blockAlign="center" gap="4">
              <Thumbnail source={itemData.image.url} size="small" />
              <Text variant="bodyMd" fontWeight="bold" as="h3">{itemData.title}</Text>
            </HorizontalStack>
          </Banner>
        )
      })
    )
  }

  function renderItem(item, id) {
    const {title, image: {url}} = item;
    return(
      <ResourceItem id={id}>
        <HorizontalStack blockAlign="center" gap="4">
          <Thumbnail source={url} size="small" />
          <Text variant="bodyMd" fontWeight="bold" as="h3">{title}</Text>
        </HorizontalStack>
      </ResourceItem>
    )
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleToggleModal}
        title="Select collections"
        primaryAction={{
          content: "Select",
          onAction: handleSelectCollections
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
            placeholder="Search collections"
            onChange={handleValueChange} 
          />
          <ResourceList
            resourceName={resourceName}
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
          <div className="po_banner_with_image">
            {renderSelectedCollections(collections)}
          </div>
        </Scrollable>      
      ) : (
        <div className="po_banner_with_image">
          {renderSelectedCollections(collections)}
        </div>
      )}
    </>
  )
}