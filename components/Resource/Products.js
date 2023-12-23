import { useState, useCallback, useContext } from "react";
import { Banner, EmptyState, Modal, TextField, ResourceList, ResourceItem, Text, Thumbnail, HorizontalStack, Scrollable } from "@shopify/polaris";
import { Box, Button } from "@chakra-ui/react";
import { ImageMajor } from '@shopify/polaris-icons';
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

  const emptyState = !searchProducts.length ? (
    <Box className="po_resource_empty_state">
      <EmptyState
        image="https://cdn.shopify.com/shopifycloud/web/assets/v1/c2c8e9c6226b6499.svg"
      >
        <Text variant="bodyMd" fontWeight="medium" as="h2">Can't find products</Text>
      </EmptyState>
    </Box>
  ) : undefined;

  const handleValueChange = useCallback(
    (value) => {
      setValue(value);
      const newSearchProducts = initialProducts.filter(product => product.title.toLowerCase().includes(value.toLowerCase()));
      setSearchProducts(newSearchProducts);
    }, [searchProducts]
  );

  const handleToggleModal = useCallback(() => setOpen((open) => !open), []);

  const handleCancelSelect = useCallback(
    () => {
      setValue("");
      setOpen(false);
      setSelectedProducts(products);
      setSearchProducts(initialProducts);
    }, [selectedProducts]
  );

  const handleSelectProducts = useCallback(
    () => {
      setValue("");
      setOpen(false);
      setIsDirty(true);
      setProducts(selectedProducts);
      setSearchProducts(initialProducts);
    }, [selectedProducts]
  );

  const handleDismissProducts = useCallback(
    (item) => {
      const newSelectedProducts = [...selectedProducts];
      const index = newSelectedProducts.indexOf(item);
      newSelectedProducts.splice(index, 1);
      setIsDirty(true);
      setProducts(newSelectedProducts);
      setSelectedProducts(newSelectedProducts);
    }, [selectedProducts]
  );

  function renderSelectedProducts(items) {
    return (
      items.map(item => {
        const itemData = initialProducts.find(product => product.id === item);
        return (
          <Banner status="info" onDismiss={() => handleDismissProducts(item)}>
            <HorizontalStack blockAlign="center" gap="4">
              <Thumbnail source={itemData.featuredImage ? itemData.featuredImage.url : ImageMajor} size="small" />
              <Text variant="bodyMd" as="span">{itemData.title}</Text>
            </HorizontalStack>
          </Banner>
        )
      })
    )
  }

  function renderItem(item, id) {
    const {title, featuredImage} = item;
    return (
      <ResourceItem id={id} key={id}>
        <HorizontalStack blockAlign="center" gap="4">
          <Thumbnail source={featuredImage ? featuredImage.url : ImageMajor} size="small" />
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
        title="Select products"
        primaryAction={{
          content: "Select",
          onAction: handleSelectProducts
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
            placeholder="Search products"
            onChange={handleValueChange} 
          />
          <ResourceList
            resourceName={resourceName}
            emptyState={emptyState}
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
          <Box className="po_banner_with_image">
            {renderSelectedProducts(products)}
          </Box>
        </Scrollable>      
      ) : (
        <Box className="po_banner_with_image">
          {renderSelectedProducts(products)}
        </Box>
      ) }
    </>
  )
}