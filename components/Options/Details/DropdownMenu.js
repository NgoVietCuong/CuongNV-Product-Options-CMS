import { useCallback, useContext } from "react";
import { VerticalStack, Layout, TextField, Text } from "@shopify/polaris";
import { Button, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { IoDuplicate, IoTrashBin } from "react-icons/io5";
import OptionSetContext from "@/context/OptionSetContext";

export default function DropdownDetail({ option, index }) {
  const { options, setOptions, setIsDirty } = useContext(OptionSetContext);

  const handleAddValue = useCallback(
    () => {
      option.dropdownMenu.push({
        optionValue: null,
        priceAddOn: null
      });
      const newOptions = [...options];
      newOptions[index] = option;
      setOptions(newOptions);
      setIsDirty(true);
    }, [options]
  );

  const handleDuplicateValue = useCallback(
    (itemIndex) => {
      const detail = {...option.dropdownMenu[itemIndex]};
      option.dropdownMenu.splice(itemIndex + 1, 0, detail);
      const newOptions = [...options];
      newOptions[index] = option;
      setOptions(newOptions);
      setIsDirty(true);
    }, [options]
  );

  const handleDeleteValue = useCallback(
    (itemIndex) => {
      option.dropdownMenu.splice(itemIndex, 1);
      const newOptions = [...options];
      newOptions[index] = option;
      setOptions(newOptions);
      setIsDirty(true);
    }, [options]
  );

  const handleValueChange = useCallback(
    (itemIndex, value) => {
      option.dropdownMenu[itemIndex].optionValue = value;
      const newOptions = [...options];
      newOptions[index] = option;
      setOptions(newOptions);
      setIsDirty(true);
    }, [options]
  );

  const handlePriceChange = useCallback(
    (itemIndex, value) => {
      const numberValue = parseFloat(value);
      option.dropdownMenu[itemIndex].priceAddOn = numberValue < 0 ? "0" : value;
      const newOptions = [...options];
      newOptions[index] = option;
      setOptions(newOptions);
      setIsDirty(true);
    }, [options]
  );

  const handlePriceRound = useCallback(
    (itemIndex, event) => {
      const numberValue = parseFloat(event.target.value);
      option.dropdownMenu[itemIndex].priceAddOn = numberValue.toFixed(2);
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
          <Text variant="headingSm" as="h6">Option values</Text>
        </Layout.Section>
        <Layout.Section oneThird>
          <Text variant="headingSm" as="h6">Price Add-ons</Text>
        </Layout.Section>
      </Layout>
      {option.dropdownMenu.map((item, itemIndex) => (
        <Layout>
          <Layout.Section oneThird>
            <TextField 
              autoComplete="off"
              value={item.optionValue}
              onChange={(value) => handleValueChange(itemIndex, value)}
            />
          </Layout.Section>
          <Layout.Section oneThird>
            <TextField 
                type="number"
                placeholder="0.00"
                autoComplete="off"
                value={item.priceAddOn}
                onChange={(value) => handlePriceChange(itemIndex, value)}
                onBlur={(event) => handlePriceRound(itemIndex, event)}
                connectedRight={
                  <ButtonGroup variant="segmented">
                    <Tooltip ml='-5px' py='5px' label='Duplicate value' placement='top' bg='white' color='blue.500' fontSize='13px'>
                      <IconButton 
                        size={"sm"}
                        variant="outline"
                        colorScheme="blue"
                        aria-label="in-cart edit"
                        border="none"
                        icon={<IoDuplicate size="18px" />}
                        onClick={() => handleDuplicateValue(itemIndex)}
                      />
                    </Tooltip>
                    <Tooltip ml='-5px' py='5px' label='Delete value' placement='top' bg='white' color='blue.500' fontSize='13px'>
                      <IconButton 
                        size={"sm"}
                        variant="outline"
                        colorScheme="blue"
                        aria-label="in-cart edit"
                        border="none"
                        isDisabled={option.dropdownMenu.length === 1}
                        icon={<IoTrashBin size="18px" />} 
                        onClick={() => handleDeleteValue(itemIndex)}
                      />
                    </Tooltip>
                  </ButtonGroup>
                }
              />
          </Layout.Section>
        </Layout>
      ))}
      <Layout>
        <Layout.Section oneThird>
          <Button size="sm" onClick={handleAddValue}>Add new value</Button>
        </Layout.Section>
        <Layout.Section oneThird>
        </Layout.Section>
      </Layout>
    </VerticalStack>
  )
}