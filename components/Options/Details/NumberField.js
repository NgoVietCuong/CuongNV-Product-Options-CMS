import { useState, useContext } from "react";
import { VerticalStack, Layout, TextField, Text } from "@shopify/polaris";
import OptionSetContext from "@/context/OptionSetContext";

export default function NumberFieldDetail({ option, index }) {
  const { options, setOptions, setIsDirty } = useContext(OptionSetContext);
  const [price, setPrice] = useState(option.numberField.priceAddOn ? option.numberField.priceAddOn.toFixed(2) : "");

  const handlePriceChange = (value) => {
    const numberValue = parseFloat(value);
    const newPrice = numberValue < 0 ? "0" : value;
    const newOptions = [...options];
    newOptions[index].numberField = { priceAddOn: numberValue < 0 ? 0 : numberValue };
    setIsDirty(true);
    setPrice(newPrice);
    setOptions(newOptions);
  }
  
  const handlePriceRound = (event) => {
    const newPrice = parseFloat(event.target.value).toFixed(2);
    const newOptions = [...options];
    newOptions[index].numberField = { priceAddOn: parseFloat(newPrice) };
    setPrice(newPrice);
    setOptions(newOptions);
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
            value={price}
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