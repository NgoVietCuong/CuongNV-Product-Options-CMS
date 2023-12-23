import { useCallback, useContext } from "react";
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
import ButtonDetail from "./Details/Button";
import { optionTypes } from "@/utils/constants";

export default function Option({ option, index }) {
  const { options, setOptions, setIsDirty } = useContext(OptionSetContext);

  const handleLabelChange = useCallback(
    (value) => {
      option.label = value;
      const newOptions = [...options];
      newOptions[index] = option;
      setOptions(newOptions);
      setIsDirty(true);
    }, [options]
  );

  const handleTypeChange = useCallback(
    (value) => {
      option.type = value;
      const newOptions = [...options];
      newOptions[index] = option;
      setOptions(newOptions);
      setIsDirty(true);
    }, [options]
  );

  return (
    <>
      <LegacyCard.Section title="General information">
        <Layout>
          <Layout.Section oneThird>
            <TextField
              label="Label on store front"
              autoComplete="off"
              value={option.label}
              onChange={handleLabelChange}
            />
          </Layout.Section>
          <Layout.Section oneThird>
            <Select
              label="Option type"
              options={optionTypes}
              value={option.type}
              onChange={handleTypeChange}
            />
          </Layout.Section>
        </Layout>
      </LegacyCard.Section>
      <LegacyCard.Section>
        {option.type === "0" && <TextBoxDetail option={option} index={index} />}
        {option.type === "1" && <NumberFieldDetail option={option} index={index} />}
        {option.type === "2" && <DropdownDetail option={option} index={index} />}
        {option.type === "3" && <CheckboxDetail option={option} index={index} />}
        {option.type === "4" && <RadioButtonDetail option={option} index={index} />}
        {option.type === "6" && <ButtonDetail option={option} index={index} />}
      </LegacyCard.Section>
    </>
  )
}