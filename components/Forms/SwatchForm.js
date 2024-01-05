import { useState, useContext, useEffect } from "react";
import { Modal, RadioButton, VerticalStack } from "@shopify/polaris";
import { IconButton, Box } from "@chakra-ui/react";
import { LuImagePlus } from "react-icons/lu";
import OptionSetContext from "@/context/OptionSetContext";
import SwatchColorPicker from "../Resource/ColorPicker";
import ImageUpload from "../Resource/ImageUpload";
import { HexToHSV, HSVToHex } from "@/utils/colorConverter";

export default function SwatchForm({ option, optionIndex, itemIndex}) {
  const { options, setOptions, setIsDirty } = useContext(OptionSetContext);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(option.swatch[itemIndex].swatchType);
  const [value, setValue] = useState(option.swatch[itemIndex].colorValue);
  const [image, setImage] = useState(option.swatch[itemIndex].imageValue);
  const [color, setColor] = useState(HexToHSV(option.swatch[itemIndex].colorValue));

  useEffect(() => {
    const Reg_Exp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    const previewSwatch = document.querySelector(`#po_preview_swatch_${optionIndex}_${itemIndex}`);
    if (previewSwatch) {
      if (type === 0 && Reg_Exp.test(`#${value}`)) {
        previewSwatch.style.backgroundColor = `#${value}`;
        previewSwatch.style.backgroundImage = "none";
      } else if (type === 1 && image) {
        previewSwatch.style.backgroundImage = `url(${image})`;
        previewSwatch.style.backgroundPosition = "center center";
        previewSwatch.style.backgroundRepeat = "no-repeat";
        previewSwatch.style.backgroundSize = "cover";
      } else {
        previewSwatch.style.backgroundColor = `#FFFFFF`;
        previewSwatch.style.backgroundImage = "none";
      }

    }
  }, [value, open, type, image]);

  useEffect(() => {
    const buttonSwatch = document.querySelector(`#button_swatch_${optionIndex}_${itemIndex}`);
    const content = buttonSwatch.querySelector("svg");
    if (option.swatch[itemIndex].swatchType === 0 && option.swatch[itemIndex].colorValue) {
      buttonSwatch.style.backgroundColor = `#${option.swatch[itemIndex].colorValue}`;
      buttonSwatch.style.backgroundImage = "none";
      content.style.visibility = "hidden";
    } else if (option.swatch[itemIndex].swatchType === 1 && option.swatch[itemIndex].imageValue) {
      buttonSwatch.style.backgroundImage = `url(${option.swatch[itemIndex].imageValue})`;
      buttonSwatch.style.backgroundPosition = "center center";
      buttonSwatch.style.backgroundRepeat = "no-repeat";
      buttonSwatch.style.backgroundSize = "cover";
      content.style.visibility = "hidden";
    } else {
      buttonSwatch.style.backgroundColor = "#EDF2F7";
      buttonSwatch.style.backgroundImage = "none";
      content.style.visibility = "visible";
    }
  }, [open]);

  const handleColorChange = (newColor) => {
    const hexColor = HSVToHex(newColor);
    setValue(hexColor);
    setColor(newColor);
  }

  const handleValueChange = (newValue) => {
    const hsvColor = HexToHSV(newValue);
    setValue(newValue);
    setColor(hsvColor);
  }

  const handleToggleModal = () => setOpen((open) => !open);

  const handleTypeChange = (_, value) => {
    setType(parseInt(value));
  }

  const handleCancelSave = () => {
    setType(option.swatch[itemIndex].swatchType);
    setValue(option.swatch[itemIndex].colorValue);
    setColor(HexToHSV(option.swatch[itemIndex].colorValue));
    setOpen(!open);
  }

  const handleSaveSwatch = () => {
    const Reg_Exp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
    const colorValue = Reg_Exp.test(`#${value}`) ? value : "";

    const swatch = [...option.swatch];
    swatch[itemIndex] = {
      ...option.swatch[itemIndex], 
      swatchType: parseInt(type), 
      colorValue: colorValue,
      imageValue: image
    };
    option.swatch = swatch;
    const newOptions = [...options];
    newOptions[optionIndex] = option;

    setOpen(!open);
    setIsDirty(true);
    setValue(colorValue);
    setOptions(newOptions);
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleCancelSave}
        title="Add swatch"
        primaryAction={{
          content: "Save",
          onAction: handleSaveSwatch
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleCancelSave,
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
                checked={type === 0}
                onChange={handleTypeChange}
              />
              {type === 0 && <SwatchColorPicker value={value} handleValueChange={handleValueChange} color={color} handleColorChange={handleColorChange} />}
              <RadioButton
                label="Image swatch"
                id="001"
                name="swatch"
                checked={type === 1}
                onChange={handleTypeChange}
              />
              {type === 1 && <ImageUpload image={image} setImage={setImage} />}
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