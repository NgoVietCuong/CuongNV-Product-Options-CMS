import { useState, useContext } from "react";
import { VerticalStack, Layout, TextField, Text } from "@shopify/polaris";
import OptionSetContext from "@/context/OptionSetContext";

export default function TextBoxDetail({ option, index }) {
  const { options, setOptions, setIsDirty } = useContext(OptionSetContext);
  const [price, setPrice] = useState(option.textBox.priceAddOn ? option.textBox.priceAddOn.toFixed(2) : "");

  const handlePriceChange = (value) => {
    const numberValue = parseFloat(value);
    const newPrice = numberValue < 0 ? "0" : value;
    const newOptions = [...options];
    newOptions[index].textBox = { priceAddOn: numberValue < 0 ? 0 : numberValue };
    setIsDirty(true);
    setPrice(newPrice);
    setOptions(newOptions);
  }
  
  const handlePriceRound = (event) => {
    const newPrice = parseFloat(event.target.value);
    const newOptions = [...options];
    newOptions[index].textBox = { priceAddOn: newPrice ? parseFloat(newPrice.toFixed(2)) : 0 };
    setPrice(newPrice);
    setOptions(newOptions);
  }

  return (
    <VerticalStack gap="3">
      <Layout>
        <Layout.Section oneThird>
          <TextField 
            label="Price Add-on"
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