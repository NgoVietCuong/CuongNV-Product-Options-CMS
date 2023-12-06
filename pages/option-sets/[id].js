import {
  Page,
  LegacyCard,
  TextField,
  Select,
  FormLayout,
} from "@shopify/polaris";
import { useState, useCallback } from "react";

import CustomerForm from "@/components/Forms/CustomerForm";
import ProductForm from "@/components/Forms/ProductForm";

export default function UpdateOptionSet() {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("0");
  const [status, setStatus] = useState("Enable");

  const options = [
    { label: "Enable", value: "enable" },
    { label: "Disabled", value: "disable" },
  ];

  const handleNameChange = useCallback(
    (newName) => setName(newName),
    []
  );

  const handlePriorityChange = useCallback(
    (newPriority) => setPriority(newPriority),
    []
  );

  const handleStatusChange = useCallback(
    (newStatus) => setStatus(newStatus),
    []
  );

  return (
    <Page>
      <LegacyCard title="General Information" sectioned>
        <FormLayout>
          <TextField
            label="Option set name"
            value={name}
            onChange={handleNameChange}
            autoComplete="off"
            placeholder="Enter your option set name"
          />
          <TextField
            label="Priority"
            type="number"
            value={priority}
            onChange={handlePriorityChange}
            autoComplete="off"
          />
          <Select
            label="Date range"
            options={options}
            onChange={handleStatusChange}
            value={status}
          />
        </FormLayout>
      </LegacyCard>

      <CustomerForm />
      <ProductForm />
    </Page>
  );
}