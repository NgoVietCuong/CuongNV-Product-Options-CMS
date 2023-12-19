import { useState, useCallback } from "react";
import { 
  LegacyCard,
  HorizontalStack,
  TextField,
  Select,
  Layout,
  Collapsible,
  Text
} from "@shopify/polaris";
import { 
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { IoDuplicate, IoTrashBin } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

export default function Option() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("0");

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  const handleSelectChange = useCallback(
    (value) => setSelected(value),
    [],
  );

  const options = [
    {label: 'Text box', value: "0"},
    {label: 'Number field', value: "1"},
    {label: 'Dropdown menu', value: "2"},
    {label: 'Checkbox', value: "3"},
    {label: 'Radio button', value: "4"},
    {label: 'Swatch', value: "5"},
    {label: 'Button', value: "6"},
  ];

  return (
    <LegacyCard subdued="true" padding="400">
      <LegacyCard.Section>
        <HorizontalStack align="space-between" blockAlign="center">
          <HorizontalStack blockAlign="center">
            <Button
              size="sm"
              variant="plain" 
              fontWeight="500" 
              color="blue.500"
              padding="0"
              marginRight="10px"
              fontSize="15px"
              onClick={handleToggle}
              rightIcon={open ? <IoIosArrowUp /> : <IoIosArrowDown />}
            >Untitle Option</Button>
            <Text color="subdued" as="p">Type: {options.find(option => option.value === selected).label}</Text>
          </HorizontalStack>
            
          <ButtonGroup variant="segmented">
            <Tooltip  ml='-5px' py='5px' label='Duplicate option' placement='top' bg='white' color='blue.500' fontSize='13px'>
              <IconButton 
                size={"sm"}
                variant="outline"
                colorScheme="blue"
                aria-label="in-cart edit"
                border="none"
                icon={<IoDuplicate size="18px" />} 
              />
            </Tooltip>
            <Tooltip  ml='-5px' py='5px' label='Delete option' placement='top' bg='white' color='blue.500' fontSize='13px'>
              <IconButton 
                size={"sm"}
                variant="outline"
                colorScheme="blue"
                aria-label="in-cart edit"
                border="none"
                icon={<IoTrashBin size="18px" />} 
              />
            </Tooltip>
          </ButtonGroup>
        </HorizontalStack>
      </LegacyCard.Section>

      <Collapsible
        open={open}
        id="basic-collapsible"
        transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
        expandOnPrint
      >
        <LegacyCard.Section title="General information">
          <Layout>
            <Layout.Section oneThird>
              <TextField
                label="Label on store front"
                autoComplete="off"
              />
            </Layout.Section>
            <Layout.Section oneThird>
            <Select
              label="Option type"
              options={options}
              onChange={handleSelectChange}
              value={selected}
            />
            </Layout.Section>
          </Layout>
        </LegacyCard.Section>
      <LegacyCard.Section>

      </LegacyCard.Section>
      </Collapsible>

    </LegacyCard>
  )
}