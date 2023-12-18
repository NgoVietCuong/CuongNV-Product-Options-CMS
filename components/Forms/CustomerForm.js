import { LegacyCard, ChoiceList } from "@shopify/polaris";
import { useState, useCallback } from "react";

export default function CustomerForm() {
  const [selected, setSelected] = useState("0");
  const handleSelectChange = useCallback(
    (value) => setSelected(value),
    []
  );

  return (
    <LegacyCard title="Apply to Customers" sectioned>
        <ChoiceList
          choices={[
            {label: "All customers", value: "0"},
            {label: "Logged-in customers", value: "1"},
            {label: "Not-logged-in customers", value: "2"},
            {label: "Specific customers", value: "3"},
            {label: "Customer tags", value: "4"}
          ]}
          selected={selected}
          onChange={handleSelectChange}
        />
    </LegacyCard>
  );
}