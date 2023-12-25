import { useContext } from "react";
import { VerticalStack, Layout, TextField, Text } from "@shopify/polaris";
import { Button, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { IoDuplicate, IoTrashBin } from "react-icons/io5";
import OptionSetContext from "@/context/OptionSetContext";

export default function ButtonDetail({ option, index }) {
  const { options, setOptions, activeError, optionErrors, setOptionErrors, setIsDirty } = useContext(OptionSetContext);

  const handleAddValue = () => {
    const button = [...option.button];
    button.push({
      optionValue: "",
      priceAddOn: ""
    })
    option.button = button;
    const newOptions = [...options];
    newOptions[index] = option;
    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].button.push(true);
    setIsDirty(true);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleDuplicateValue = (itemIndex) => {
    const detail = {...option.button[itemIndex]};
    option.button.splice(itemIndex + 1, 0, detail);
    const newOptions = [...options];
    newOptions[index] = option;
    const error = optionErrors[index].button[itemIndex];
    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].button.splice(itemIndex + 1, 0, error);
    setIsDirty(true);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleDeleteValue = (itemIndex) => {
    option.button.splice(itemIndex, 1);
    const newOptions = [...options];
    newOptions[index] = option;
    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].button.splice(itemIndex, 1);
    setIsDirty(true);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleValueChange = (itemIndex, value) => {
    const detailArray = [...option.button];
    detailArray[itemIndex] = {...option.button[itemIndex], optionValue: value};
    option.button = detailArray;
    const newOptions = [...options];
    newOptions[index] = option;
    const newOptionErrors = [...optionErrors];
    const buttonErrors = [...newOptionErrors[index].button]
    if (value.trim()) {
      buttonErrors[itemIndex] = false;
    } else {
      buttonErrors[itemIndex] = true;
    }
    newOptionErrors[index].button = buttonErrors;
    setIsDirty(true);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handlePriceChange = (itemIndex, value) => {
    const numberValue = parseFloat(value);
    const detailArray = [...option.button];
    detailArray[itemIndex] = {...option.button[itemIndex], priceAddOn: numberValue < 0 ? "0" : value};
    option.button = detailArray;
    const newOptions = [...options];
    newOptions[index] = option;
    setOptions(newOptions);
    setIsDirty(true);
  }

  const handlePriceRound = (itemIndex, event) => {
    const numberValue = parseFloat(event.target.value);
    const detailArray = [...option.button];
    detailArray[itemIndex] = {...option.button[itemIndex], priceAddOn: numberValue.toFixed(2)};
    option.button = detailArray;
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
      {option.button.map((item, itemIndex) => (
        <Layout>
          <Layout.Section oneThird>
            <TextField 
              autoComplete="off"
              value={item.optionValue}
              onChange={(value) => handleValueChange(itemIndex, value)}
              error={(activeError && optionErrors[index].button[itemIndex]) && "Option value is required"}
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
                        isDisabled={option.button.length === 1}
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