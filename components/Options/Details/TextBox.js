import { useCallback, useContext } from "react";
import { VerticalStack, Layout, TextField, Text } from "@shopify/polaris";
import OptionSetContext from "@/context/OptionSetContext";

export default function TextBoxDetail({ option, index }) {
  const { options, setOptions, setIsDirty } = useContext(OptionSetContext);

  const handlePriceChange = useCallback(
    (value) => {
      const numberValue = parseFloat(value);
      option.textBox.priceAddOn = numberValue < 0 ? "0" : value;
      const newOptions = [...options];
      newOptions[index] = option;
      setOptions(newOptions);
      setIsDirty(true);
    }, [options]
  );
  
  const handlePriceRound = useCallback(
    (event) => {
      const numberValue = parseFloat(event.target.value);
      option.textBox.priceAddOn = numberValue.toFixed(2);
      const newOptions = [...options];
      newOptions[index] = option;
      setOptions(newOptions);
      setIsDirty(true);
    }, [options]
  )

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
            value={option.textBox.priceAddOn}
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