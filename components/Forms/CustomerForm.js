import { LegacyCard, LegacyStack, RadioButton } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function CustomerForm() {
  const [value, setValue] = useState("0");
  const handleChange = useCallback(
    (_, newValue) => setValue(newValue),
    []
  );

  return (
    <LegacyCard title="Apply to Customers" sectioned>
      <LegacyStack vertical>
        <RadioButton
          label="All customers"
          id="all customers"
          checked={value === "all customers"}
          onChange={handleChange}
        />
        <RadioButton
          label="Logged-in customers"
          id="logged-in customers"
          checked={value === "logged-in customers"}
          onChange={handleChange}
        />
        <RadioButton
          label="Not-logged-in customers"
          id="not-logged-in customers"
          checked={value === "not-logged-in customers"}
          onChange={handleChange}
        />
        <RadioButton
          label="Specific customers"
          id="specfic customers"
          checked={value === "specfic customers"}
          onChange={handleChange}
        />
        <RadioButton
          label="Customer tags"
          id="customer tags"
          checked={value === "customer tags"}
          onChange={handleChange}
        />
      </LegacyStack>
    </LegacyCard>
  );
}