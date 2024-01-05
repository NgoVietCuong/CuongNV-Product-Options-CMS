import { useContext } from "react";
import { FormLayout, LegacyCard, RadioButton, Text } from "@shopify/polaris";
import OptionSetContext from "@/context/OptionSetContext";
import ProductResource from "../Resource/Products";
import CollectionResource from "../Resource/Collections";
import ProductTagResource from "../Resource/ProductTags";

export default function ProductForm() {
  const { applyToProduct, setApplyToProduct, setIsDirty } = useContext(OptionSetContext);

  const handleValueChange = (_, value) => {
    setApplyToProduct(value);
    setIsDirty(true);
  }

  return (
    <LegacyCard sectioned>
      <FormLayout>
        <Text variant="headingSm" as="h6">Apply to Products</Text>
        <RadioButton
          label="All products"
          id="00"
          name="products"
          checked={applyToProduct === "00"}
          onChange={handleValueChange}
        />
        <RadioButton
          label="Specific products"
          id="01"
          name="products"
          checked={applyToProduct === "01"}
          onChange={handleValueChange}
        />
        {applyToProduct === "01" && <ProductResource />}
        <RadioButton
          label="Product collections"
          id="02"
          name="products"
          checked={applyToProduct === "02"}
          onChange={handleValueChange}
        />
        {applyToProduct === "02" && <CollectionResource />}
        <RadioButton
          label="Product tags"
          id="03"
          name="products"
          checked={applyToProduct === "03"}
          onChange={handleValueChange}
        />
        {applyToProduct === "03" && <ProductTagResource />}
      </FormLayout>
    </LegacyCard>
  );
}