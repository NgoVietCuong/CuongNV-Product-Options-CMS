import { useState, useCallback, useContext } from "react";
import { Banner, Modal, TextField, ResourceList, ResourceItem, Text, Thumbnail, HorizontalStack, Scrollable } from "@shopify/polaris";
import { Button } from "@chakra-ui/react";
import OptionSetContext from "@/context/OptionSetContext";

export default function ProductResource() {
  const { initialProducts, products, setProducts, setIsDirty } = useContext(OptionSetContext);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [searchProducts, setSearchProducts] = useState(initialProducts);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const resourceName = {
    singular: "product",
    plural: "products"
  }

  const handleValueChange = useCallback(
    (value) => {
      setValue(value);
      const newSearchProducts = initialProducts.filter(product => product.title.toLowerCase().includes(value.toLowerCase()));
      console.log('search products', newSearchProducts);
      setSearchProducts(newSearchProducts);
    }, [searchProducts]
  );

  const handleToggleModal = useCallback(() => setOpen((open) => !open), []);

  const handleSelectProducts = useCallback(
    () => {
      setProducts(selectedProducts);
      setOpen(false);
      setIsDirty(true);
    }, [selectedProducts]
  );

  const handleDismissProducts = useCallback(
    (item) => {
      const newSelectedProducts = [...selectedProducts];
      const index = newSelectedProducts.indexOf(item);
      newSelectedProducts.splice(index, 1);
      setSelectedProducts(newSelectedProducts);
      setProducts(newSelectedProducts);
      setIsDirty(true);
    }, [selectedProducts]
  );

  function renderSelectedProducts(items) {
    return (
      items.map(item => {
        const itemData = initialProducts.find(product => product.id === item);
        return (
          <Banner status="info" onDismiss={() => handleDismissProducts(item)}>
            <HorizontalStack blockAlign="center" gap="4">
              <Thumbnail source={itemData.featuredImage.url} size="small" />
              <Text variant="bodyMd" fontWeight="bold" as="h3">{itemData.title}</Text>
            </HorizontalStack>
          </Banner>
        )
      })
    )
  }

  function renderItem(item, id) {
    const {title, featuredImage: {url}} = item;
    return (
      <ResourceItem id={id}>
        <HorizontalStack blockAlign="center" gap="4">
          <Thumbnail source={url} size="small" />
          <Text variant="bodyMd" as="h3">{title}</Text>
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
            items={searchProducts}
            renderItem={renderItem}
            selectedItems={selectedProducts}
            onSelectionChange={setSelectedProducts}
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
      >Browse products</Button>
      {products.length > 4 ? (
        <Scrollable style={{height: '230px'}} horizontal={false} focusable>
          <div className="po_banner_with_image">
            {renderSelectedProducts(products)}
          </div>
        </Scrollable>      
      ) : (
        <div className="po_banner_with_image">
          {renderSelectedProducts(products)}
        </div>
      ) }
    </>
  )
}