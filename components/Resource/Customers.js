import { useState, useCallback, useContext } from "react";
import { Banner, EmptyState, Modal, TextField, ResourceList, ResourceItem, Text, HorizontalStack, Scrollable } from "@shopify/polaris";
import { Button, Grid, GridItem } from "@chakra-ui/react";
import OptionSetContext from "@/context/OptionSetContext";

export default function CustomerResource() {
  const { initialCustomers, customers, setCustomers, setIsDirty } = useContext(OptionSetContext);
  const [value , setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [searchCustomers, setSearchCustomers] = useState(initialCustomers);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  console.log('seletedCustomers', selectedCustomers);
  console.log('customers', customers);

  const resourceName = {
    singular: "customer",
    plural: "customers"
  }

  const emptyState = !searchCustomers.length ? (
    <div className="po_resource_empty_state">
      <EmptyState
        image="https://cdn.shopify.com/shopifycloud/web/assets/v1/93a30c07e111eac4.svg"
      >
        <Text variant="bodyMd" fontWeight="medium" as="h2">Can't find customers</Text>
      </EmptyState>
    </div>
  ) : undefined;

  const handleValueChange = useCallback(
    (value) => {
      setValue(value);
    }, []
  );

  const handleToggleModal = useCallback(() => setOpen((open) => !open), []);

  const handleSelectCustomers = useCallback(
    () => {
      setCustomers(selectedCustomers);
      setOpen(false);
      setIsDirty(true);
    }, [selectedCustomers]
  );

  const handleDismissCustomers = useCallback(
    (item) => {

    }, [selectedCustomers]
  )

  function renderSelectedCustomers(items) {
    return (
      items.map(item => {
        const itemData = initialCustomers.find(customer => customer.id === item);
        return (
          <Banner status="info" onDismiss={() => handleDismissCustomers(item)}>
            <Grid w="100%" gridTemplateColumns="0.14fr 0.8fr" alignItems='center'>
              <GridItem>
                <Text variant="bodyMd" as="span">{itemData.displayName}</Text>
              </GridItem>
              <GridItem>
                <Text variant="bodyMd" as="span">{itemData.email}</Text>
              </GridItem>
            </Grid>
          </Banner>
        )
      })
    )
  }

  function renderItem(item, id) {
    const {displayName, email} = item;
    return(
      <ResourceItem id={id}>
        <Grid w="100%" gridTemplateColumns="0.3fr 0.7fr" alignItems='center'>
          <GridItem>
            <Text variant="bodyMd" as="span">{displayName}</Text>
          </GridItem>
          <GridItem>
            <Text variant="bodyMd" as="span">{email}</Text>
          </GridItem>
        </Grid>
      </ResourceItem>
    )
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleToggleModal}
        title="Select customers"
        primaryAction={{
          content: "Select",
          onAction: handleSelectCustomers
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
            placeholder="Search customers"
            onChange={handleValueChange} 
          />
          <ResourceList
            resourceName={resourceName}
            emptyState={emptyState}
            items={searchCustomers}
            renderItem={renderItem}
            selectedItems={selectedCustomers}
            onSelectionChange={setSelectedCustomers}
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
      >Browse customers</Button>
      {customers.length > 4 ? (
        <Scrollable style={{height: '190px'}} horizontal={false} focusable>
          <div className="po_banner_without_image">
            {renderSelectedCustomers(customers)}
          </div>
        </Scrollable>      
      ) : (
        <div className="po_banner_without_image">
          {renderSelectedCustomers(customers)}
        </div>
      )}
    </>
  )
}