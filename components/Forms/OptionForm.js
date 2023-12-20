import { LegacyCard, FormLayout } from "@shopify/polaris";
import { Button } from "@chakra-ui/react";
import Option from "../Options/Option";

export default function OptionForm() {
  return (
    <LegacyCard title="Options" sectioned>
      <FormLayout>
        <Option />
        <Button size="sm" h="34px" variant="solid" colorScheme="blue">Add new option</Button>
      </FormLayout>
    </LegacyCard>
  )
}