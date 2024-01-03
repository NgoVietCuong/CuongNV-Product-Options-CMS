import { useState, useContext, useEffect } from "react";
import { Modal, RadioButton, VerticalStack } from "@shopify/polaris";
import { IconButton, Box } from "@chakra-ui/react";
import { LuImagePlus } from "react-icons/lu";
import OptionSetContext from "@/context/OptionSetContext";
import SwatchColorPicker from "../Resource/ColorPicker";
import convert from "color-convert"

export default function SwatchForm({ option, optionIndex, itemIndex}) {
  const { options, setOptions, setIsDirty } = useContext(OptionSetContext);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(option.swatch[itemIndex].colorValue);
  const [color, setColor] = useState(option.swatch[itemIndex].colorValue);

  // console.log('test1', convert.hex.hsv("0000FF"));
  // console.log('test2', convert.hsv.hex(70.71428571428571, 95.625, 78.9));

  const handleColorChange = (newColor) => {

  }

  const handleValueChange = (newValue) => {

  }

  useEffect(() => {
    let { hue: h, saturation: s, brightness: b} = color;
    s = s*100;
    b = b*100;
    const hexColor = convert.hsv.hex(h, s, b);
    const previewSwatch = document.querySelector(`#po_preview_swatch_${optionIndex}_${itemIndex}`);
    previewSwatch.style.backgroundColor = `#${hexColor}`;
    setValue(hexColor);
  }, [color]);

  const handleToggleModal = () => setOpen((open) => !open);

  const handleTypeChange = (_, value) => {
    const swatch = [...option.swatch];
    swatch[itemIndex] = {...option.swatch[itemIndex], swatchType: parseInt(value)};
    option.swatch = swatch;
    const newOptions = [...options];
    newOptions[optionIndex] = option;
    setOptions(newOptions);
    setIsDirty(true);
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleToggleModal}
        title="Add swatch"
        primaryAction={{
          content: "Save",
          onAction: () => {}
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {},
          },
        ]}
      >
        <Box className="po_swatch_container">
          <Modal.Section>
            <Box className="po_preview_swatch_container">
              <Box
                id={`po_preview_swatch_${optionIndex}_${itemIndex}`}
                className={"po_preview_swatch"}
              ></Box>
            </Box>
            <VerticalStack gap="4">
              <RadioButton
                label="Color swatch"
                id="000"
                name="swatch"
                checked={option.swatch[itemIndex].swatchType === 0}
                onChange={handleTypeChange}
              />
              {option.swatch[itemIndex].swatchType === 0 && <SwatchColorPicker value={value} setValue={setValue} color={color} setColor={setColor} />}
              <RadioButton
                label="Image swatch"
                id="001"
                name="swatch"
                checked={option.swatch[itemIndex].swatchType === 1}
                onChange={handleTypeChange}
              />
            </VerticalStack>
          </Modal.Section>
        </Box>
      </Modal>
      <IconButton
        id={`button_swatch_${optionIndex}_${itemIndex}`}
        size="sm"
        w="34px"
        h="34px"
        color="gray.600"
        icon={<LuImagePlus size="16px" />}
        onClick={handleToggleModal}
      />
    </>
  )
}