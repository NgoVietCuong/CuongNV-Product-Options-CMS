import { useState, useContext } from "react";
import { 
  LegacyCard,
  TextField,
  Select,
  Layout,
} from "@shopify/polaris";
import TextBoxDetail from "./Details/TextBox";
import NumberFieldDetail from "./Details/NumberField";
import OptionSetContext from "@/context/OptionSetContext";
import DropdownDetail from "./Details/DropdownMenu";
import CheckboxDetail from "./Details/Checkbox";
import RadioButtonDetail from "./Details/RadioButton";
import SwatchDetail from "./Details/Swatch";
import ButtonDetail from "./Details/Button";
import { optionTypes } from "@/utils/constants";

export default function Option({ option, index }) {
  const { options, setOptions, activeError, optionErrors, setOptionErrors, setIsDirty } = useContext(OptionSetContext);
  const [label, setLabel] = useState(option.label);
  const [type, setType] = useState(option.type.toString());

  const handleLabelChange = (value) => {
    const newOptions = [...options];
    newOptions[index].label = value;
    const newOptionErrors = [...optionErrors];
    if (value.trim()) {
      newOptionErrors[index].label = false;
    } else {
      newOptionErrors[index].label = true;
    }
    setLabel(value);
    setIsDirty(true);
    setOptions(newOptions);
    setOptionErrors(newOptionErrors);
  }

  const handleTypeChange = (value) => {
    const newOptions = [...options];
    newOptions[index].type = parseInt(value);
    setType(value);
    setIsDirty(true);
    setOptions(newOptions);
  }

  return (
    <>
      <LegacyCard.Section title="General information">
        <Layout>
          <Layout.Section oneThird>
            <TextField
              label="Label on store front"
              autoComplete="off"
              value={label}
              onChange={handleLabelChange}
              error={(activeError && optionErrors[index].label) && "Option label is required"}
            />
          </Layout.Section>
          <Layout.Section oneThird>
            <Select
              label="Option type"
              options={optionTypes}
              value={type}
              onChange={handleTypeChange}
            />
          </Layout.Section>
        </Layout>
      </LegacyCard.Section>
      <LegacyCard.Section>
        {option.type === 0 && <TextBoxDetail option={option} index={index} />}
        {option.type === 1 && <NumberFieldDetail option={option} index={index} />}
        {option.type === 2 && <DropdownDetail option={option} index={index} />}
        {option.type === 3 && <CheckboxDetail option={option} index={index} />}
        {option.type === 4 && <RadioButtonDetail option={option} index={index} />}
        {option.type === 5 && <SwatchDetail option={option} index={index} />}
        {option.type === 6 && <ButtonDetail option={option} index={index} />}
      </LegacyCard.Section>
    </>
  )
}