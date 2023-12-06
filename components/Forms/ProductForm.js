import { LegacyCard, LegacyStack, RadioButton } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function ProductCard() {
  const [value, setValue] = useState("all products");
  const handleChange = useCallback(
    (_, newValue) => setValue(newValue),
    []
  );

  return (
    <LegacyCard title="Apply to Products" sectioned>
      <LegacyStack vertical>
        <RadioButton
          label="All products"
          id="all products"
          checked={value === "all products"}
          onChange={handleChange}
        />
        <RadioButton
          label="Specific products"
          id="specific products"
          checked={value === "specific products"}
          onChange={handleChange}
        />
        <RadioButton
          label="Product collections"
          id="product collections"
          checked={value === "product collections"}
          onChange={handleChange}
        />
        <RadioButton
          label="Product tags"
          id="product tags"
          checked={value === "product tags"}
          onChange={handleChange}
        />
      </LegacyStack>
    </LegacyCard>
  );
}