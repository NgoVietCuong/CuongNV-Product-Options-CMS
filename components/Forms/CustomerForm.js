import { useContext } from "react";
import { FormLayout, LegacyCard, RadioButton, Text } from "@shopify/polaris";
import OptionSetContext from "@/context/OptionSetContext";
import CustomerResource from "../Resource/Customers";
import CustomerTagResource from "../Resource/CustomerTags";

export default function CustomerForm() {
  const { applyToCustomer, setApplyToCustomer, setIsDirty } = useContext(OptionSetContext);
  const handleValueChange = (_, value) => {
    setApplyToCustomer(value);
    setIsDirty(true);
  }

  return (
    <LegacyCard sectioned>
        <FormLayout>
        <Text variant="headingSm" as="h6">Apply to Customers</Text>
          <RadioButton
            label="All customers"
            id="0"
            name="customers"
            checked={applyToCustomer === "0"}
            onChange={handleValueChange}
          />
          <RadioButton
            label="Logged-in customers"
            id="1"
            name="customers"
            checked={applyToCustomer === "1"}
            onChange={handleValueChange}
          />
          <RadioButton
            label="Not-logged-in customers"
            id="2"
            name="customers"
            checked={applyToCustomer === "2"}
            onChange={handleValueChange}
          />
          <RadioButton
            label="Specific customers"
            id="3"
            name="customers"
            checked={applyToCustomer === "3"}
            onChange={handleValueChange}
          />
          {applyToCustomer === "3" && <CustomerResource />}
          <RadioButton
            label="Customer tags"
            id="4"
            name="customers"
            checked={applyToCustomer === "4"}
            onChange={handleValueChange}
          />
          {applyToCustomer === "4" && <CustomerTagResource />}
        </FormLayout>
    </LegacyCard>
  );
}