import { useContext } from "react";
import { VerticalStack, Layout, TextField, Text } from "@shopify/polaris";
import { Button, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { IoDuplicate, IoTrashBin } from "react-icons/io5";
import OptionSetContext from "@/context/OptionSetContext";

export default function CheckboxDetail({ option, index }) {
  const { options, setOptions, activeError, optionErrors, setOptionErrors, setIsDirty } = useContext(OptionSetContext);

  const handleAddValue = () => {
    const checkbox = [...option.checkbox];
    checkbox.push({
      optionValue: "",
      priceAddOn: ""
    })
    option.checkbox = checkbox;
    const newOptions = [...options];
    newOptions[index] = option;
    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].checkbox.push(true);
    setIsDirty(true);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleDuplicateValue = (itemIndex) => {
    const detail = {...option.checkbox[itemIndex]};
    option.checkbox.splice(itemIndex + 1, 0, detail);
    const newOptions = [...options];
    newOptions[index] = option;
    const error = optionErrors[index].checkbox[itemIndex];
    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].checkbox.splice(itemIndex + 1, 0, error);
    setIsDirty(true);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleDeleteValue = (itemIndex) => {
    option.checkbox.splice(itemIndex, 1);
    const newOptions = [...options];
    newOptions[index] = option;
    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].checkbox.splice(itemIndex, 1);
    setIsDirty(true);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleValueChange = (itemIndex, value) => {
    const detailArray = [...option.checkbox];
    detailArray[itemIndex] = {...option.checkbox[itemIndex], optionValue: value};
    option.checkbox = detailArray;
    const newOptions = [...options];
    newOptions[index] = option;
    const newOptionErrors = [...optionErrors];
    const checkboxErrors = [...newOptionErrors[index].checkbox]
    if (value.trim()) {
      checkboxErrors[itemIndex] = false;
    } else {
      checkboxErrors[itemIndex] = true;
    }
    newOptionErrors[index].checkbox = checkboxErrors;
    setIsDirty(true);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handlePriceChange = (itemIndex, value) => {
    const numberValue = parseFloat(value);
    const detailArray = [...option.checkbox];
    detailArray[itemIndex] = {...option.checkbox[itemIndex], priceAddOn: numberValue < 0 ? "0" : value};
    option.checkbox = detailArray;
    const newOptions = [...options];
    newOptions[index] = option;
    setOptions(newOptions);
    setIsDirty(true);
  }

  const handlePriceRound = (itemIndex, event) => {
    const numberValue = parseFloat(event.target.value);
    const detailArray = [...option.checkbox];
    detailArray[itemIndex] = {...option.checkbox[itemIndex], priceAddOn: numberValue.toFixed(2)};
    option.checkbox = detailArray;
    const newOptions = [...options];
    newOptions[index] = option;
    setOptions(newOptions);
    setIsDirty(true);
  }

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
      {option.checkbox.map((item, itemIndex) => (
        <Layout>
          <Layout.Section oneThird>
            <TextField 
              autoComplete="off"
              value={item.optionValue}
              onChange={(value) => handleValueChange(itemIndex, value)}
              error={(activeError && optionErrors[index].checkbox[itemIndex]) && "Option value is required"}
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
                        isDisabled={option.checkbox.length === 1}
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