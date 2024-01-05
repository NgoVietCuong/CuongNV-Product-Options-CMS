import { useState, useContext } from "react";
import { VerticalStack, Layout, TextField, Text } from "@shopify/polaris";
import { Button, ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import { IoDuplicate, IoTrashBin } from "react-icons/io5";
import OptionSetContext from "@/context/OptionSetContext";

export default function ButtonDetail({ option, index }) {
  const { options, setOptions, activeError, optionErrors, setOptionErrors, setIsDirty } = useContext(OptionSetContext);
  const [values, setValues] = useState(option.button.map(item => item.optionValue));
  const [prices, setPrices] = useState(option.button.map(item => item.priceAddOn ? item.priceAddOn.toFixed(2) : ""));

  const handleAddValue = () => {
    const newValues = [...values];
    newValues.push("");

    const newPrices = [...prices];
    newPrices.push("");

    const button = [...option.button];
    button.push({
      optionValue: "",
      priceAddOn: 0
    });
    option.button = button;
    const newOptions = [...options];
    newOptions[index] = option;

    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].button.push(true);

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

    const detail = {...option.button[itemIndex]};
    option.button.splice(itemIndex + 1, 0, detail);
    const newOptions = [...options];
    newOptions[index] = option;

    const error = optionErrors[index].button[itemIndex];
    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].button.splice(itemIndex + 1, 0, error);

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
    newPrices.splice(itemIndex, 1);

    option.button.splice(itemIndex, 1);
    const newOptions = [...options];
    newOptions[index] = option;

    const newOptionErrors = [...optionErrors];
    newOptionErrors[index].button.splice(itemIndex, 1);

    setIsDirty(true);
    setValues(newValues);
    setPrices(newPrices);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleValueChange = (itemIndex, value) => {
    const newValues = [...values];
    newValues[itemIndex] = value;

    const button = [...option.button];
    button[itemIndex] = {...option.button[itemIndex], optionValue: value};
    option.button = button;
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
    setValues(newValues);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handlePriceChange = (itemIndex, value) => {
    const numberValue = parseFloat(value);
    const newPrices = [...prices];
    newPrices[itemIndex] = numberValue < 0 ? "0" : value;

    const button = [...option.button];
    button[itemIndex] = {...option.button[itemIndex], priceAddOn: numberValue < 0 ? 0 : numberValue};
    option.button = button;
    const newOptions = [...options];
    newOptions[index] = option;

    setIsDirty(true);
    setPrices(newPrices);
    setOptions(newOptions);
  }

  const handlePriceRound = (itemIndex, event) => {
    const numberValue = parseFloat(event.target.value);
    const newPrices = [...prices];
    newPrices[itemIndex] = numberValue.toFixed(2);

    const button = [...option.button];
    button[itemIndex] = {...option.button[itemIndex], priceAddOn: numberValue ? parseFloat(numberValue.toFixed(2)) : 0 };
    option.button = button;
    const newOptions = [...options];
    newOptions[index] = option;

    setIsDirty(true);
    setPrices(newPrices);
    setOptions(newOptions);
  }

  return (
    <VerticalStack gap="3">
      {option.button.map((item, itemIndex) => (
        <Layout >
          <Layout.Section oneThird>
            <TextField
              label="Option values"
              autoComplete="off"
              value={values[itemIndex]}
              onChange={(value) => handleValueChange(itemIndex, value)}
              error={(activeError && optionErrors[index].button[itemIndex]) && "Option value is required"}
            />
          </Layout.Section>
          <Layout.Section oneThird>
            <TextField
              label="Price Add-ons"
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