import { useContext } from "react";
import { VerticalStack, Layout, TextField, Text } from "@shopify/polaris";
import OptionSetContext from "@/context/OptionSetContext";

export default function NumberFieldDetail({ option, index }) {
  const { options, setOptions, setIsDirty } = useContext(OptionSetContext);

  const handlePriceChange = (value) => {
    const numberValue = parseFloat(value);
    option.numberField = { priceAddOn: numberValue < 0 ? "0" : value };
    const newOptions = [...options];
    newOptions[index] = option;
    setOptions(newOptions);
    setIsDirty(true);
  }
  
  const handlePriceRound = (event) => {
    const numberValue = parseFloat(event.target.value);
    option.numberField = { priceAddOn: numberValue.toFixed(2) };
    const newOptions = [...options];
    newOptions[index] = option;
    setOptions(newOptions);
    setIsDirty(true);
  }

  return (
    <VerticalStack gap="3">
      <Layout>
        <Layout.Section oneThird>
          <Text variant="headingSm" as="h6">Price Add-on</Text>
        </Layout.Section>
        <Layout.Section oneThird>
        </Layout.Section>
      </Layout>
      <Layout>
        <Layout.Section oneThird>
          <TextField 
            type="number"
            placeholder="0.00"
            autoComplete="off"
            value={option.numberField.priceAddOn}
            onChange={handlePriceChange}
            onBlur={handlePriceRound}
          />
        </Layout.Section>
        <Layout.Section oneThird>
        </Layout.Section>
      </Layout>
    </VerticalStack>
  )
}