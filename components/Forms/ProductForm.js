import { LegacyCard, ChoiceList } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function ProductCard() {
  const [selected, setSelected] = useState("0");
  const handleSelectChange = useCallback(
    (value) => setSelected(value),
    []
  );

  return (
    <LegacyCard title="Apply to Products" sectioned>
      <ChoiceList
          choices={[
            {label: "All products", value: "0"},
            {label: "Specific products", value: "1"},
            {label: "Product collections", value: "2"},
            {label: "Product tags", value: "3"},
          ]}
          selected={selected}
          onChange={handleSelectChange}
        />
    </LegacyCard>
  );
}