import { useState, useContext } from "react";
import { VerticalStack, Layout, TextField, Text } from "@shopify/polaris";
import { Button, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { IoDuplicate, IoTrashBin } from "react-icons/io5";
import OptionSetContext from "@/context/OptionSetContext";

export default function DropdownDetail({ option, index }) {
  const { options, setOptions, activeError, optionErrors, setOptionErrors, setIsDirty } = useContext(OptionSetContext);
  const [values, setValues] = useState(option.dropdownMenu.map(item => item.optionValue));
  const [prices, setPrices] = useState(option.dropdownMenu.map(item => item.priceAddOn ? item.priceAddOn.toFixed(2) : ""));

  const handleAddValue = () => {
    const newValues = [...values];
    newValues.push("");
    const newPrices = [...prices];
    newPrices.push(NaN);
    const dropdownMenu = newValues.map((value, valueIndex) => {
      return {
        optionValue: value,
        priceAddOn: newPrices[valueIndex]
      }
    });
    option.dropdownMenu = dropdownMenu;
    const newOptions = [...options];
    newOptions[index] = option;
    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].dropdownMenu.push(true);
    setIsDirty(true);
    setValues(newValues);
    setPrices(newPrices);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleDuplicateValue = (itemIndex) => {
    const newValues = [...values];
    newValues.splice(itemIndex + 1, 0, values[itemIndex]);
    const newPrices = [...prices];
    newPrices.splice(itemIndex + 1, 0, prices[itemIndex]);
    const dropdownMenu = newValues.map((value, valueIndex) => {
      return {
        optionValue: value,
        priceAddOn: newPrices[valueIndex]
      }
    });
    option.dropdownMenu = dropdownMenu;
    const newOptions = [...options];
    newOptions[index] = option;
    const error = optionErrors[index].dropdownMenu[itemIndex];
    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].dropdownMenu.splice(itemIndex + 1, 0, error);
    setIsDirty(true);
    setValues(newValues);
    setPrices(newPrices);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleDeleteValue = (itemIndex) => {
    const newValues = [...values];
    newValues.splice(itemIndex, 1);
    const newPrices = [...prices];
    newPrices.splice(itemIndex + 1);
    const dropdownMenu = newValues.map((value, valueIndex) => {
      return {
        optionValue: value,
        priceAddOn: newPrices[valueIndex]
      }
    });
    option.dropdownMenu = dropdownMenu;
    const newOptions = [...options];
    newOptions[index] = option;
    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].dropdownMenu.splice(itemIndex, 1);
    setIsDirty(true);
    setValues(newValues);
    setPrices(newPrices);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleValueChange = (itemIndex, value) => {
    const newValues = [...values];
    newValues[itemIndex] = value;
    const detailArray = [...option.dropdownMenu];
    detailArray[itemIndex] = {...option.dropdownMenu[itemIndex], optionValue: value};
    option.dropdownMenu = detailArray;
    const newOptions = [...options];
    newOptions[index] = option;
    const newOptionErrors = [...optionErrors];
    const dropdownMenuErrors = [...newOptionErrors[index].dropdownMenu]
    if (value.trim()) {
      dropdownMenuErrors[itemIndex] = false;
    } else {
      dropdownMenuErrors[itemIndex] = true;
    }
    newOptionErrors[index].dropdownMenu = dropdownMenuErrors;
    setIsDirty(true);
    setValues(newValues);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handlePriceChange = (itemIndex, value) => {
    const numberValue = parseFloat(value);
    const detailArray = [...option.dropdownMenu];
    detailArray[itemIndex] = {...option.dropdownMenu[itemIndex], priceAddOn: numberValue < 0 ? 0 : numberValue};
    option.dropdownMenu = detailArray;
    const newOptions = [...options];
    newOptions[index] = option;
    setOptions(newOptions);
    setIsDirty(true);
  }

  const handlePriceRound = (itemIndex, event) => {
    const numberValue = parseFloat(event.target.value);
    const detailArray = [...option.dropdownMenu];
    detailArray[itemIndex] = {...option.dropdownMenu[itemIndex], priceAddOn: parseFloat(numberValue.toFixed(2))};
    option.dropdownMenu = detailArray;
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
      {option.dropdownMenu.map((item, itemIndex) => (
        
        <Layout>
          {console.log('test', item.priceAddOn)}
          <Layout.Section oneThird>
            <TextField 
              autoComplete="off"
              value={values[itemIndex]}
              onChange={(value) => handleValueChange(itemIndex, value)}
              error={(activeError && optionErrors[index].dropdownMenu[itemIndex]) && "Option value is required"}
            />
          </Layout.Section>
          <Layout.Section oneThird>
            <TextField 
                type="number"
                placeholder="0.00"
                autoComplete="off"
                value={prices[itemIndex]}
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