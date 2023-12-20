import { useState, useCallback, useContext } from "react";
import { Banner, Modal, TextField, ResourceList, ResourceItem, Text, Thumbnail, HorizontalStack, Scrollable } from "@shopify/polaris";
import { Button } from "@chakra-ui/react";
import OptionSetContext from "@/context/OptionSetContext";

export default function ProductResource() {
  const { initialProducts, products, setProducts, setIsDirty } = useContext(OptionSetContext);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  // console.log(initialProducts)

  console.log("test", products)

  const resourceName = {
    singular: "product",
    plural: "products"
  }

  const handleValueChange = useCallback(
    (value) => {
      setValue(value);
    }, []
  );

  const handleToggleModal = useCallback(
    () => setOpen((open) => !open)
    , []
  );

  const handleSelectProducts = useCallback(
    () => {
      setProducts(selectedItems);
      setOpen(false);
    }, [selectedItems]
  )

  function renderSelectedItems(items) {
    return (
      items.map(item => {
        return (
          <Banner status="info" onDismiss={() => {}}>
            hihi
          </Banner>
        )
        })
    )
  }

  function renderItem(item) {
    const {id, title, featuredImage: {url}} = item;
    return (
      <ResourceItem
        id={id}
      >
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
        title="Select products"
        primaryAction={{
          content: "Select",
          onAction: handleSelectProducts
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
            placeholder="Search products"
            onChange={handleValueChange} 
          />
          <ResourceList
            resourceName={resourceName}
            items={initialProducts}
            renderItem={renderItem}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            selectable
          />
        </Modal.Section>
      </Modal>
      <TextField
        value={value}
        placeholder="Search products"
        onChange={handleValueChange}
        connectedRight={
          <Button 
            size="md" 
            fontSize="sm" 
            variant="outline" 
            borderColor="#353535" 
            color="#353535" 
            fontWeight="500" 
            height="34px"
            onClick={handleToggleModal}
          >Browse</Button>
        }
      />
      {products.length > 4 ? (
        <Scrollable style={{height: '200px'}} focusable>
          {renderSelectedItems(products)}
      </Scrollable>      
      ) : (
        <>
          {renderSelectedItems(products)}
        </>
      ) }

    </>
  )
}