import { useState } from "react";
import { FormLayout, TextField, ColorPicker } from "@shopify/polaris";

export default function SwatchColorPicker({ value, handleValueChange, color, handleColorChange}) {
  console.log('color', color)
  return (
    <FormLayout>
      <TextField
        label="Color Picker (Hex)"
        prefix="#"
        value={value}
        onChange={handleValueChange}
      />
      <ColorPicker onChange={handleColorChange} color={color}/>
    </FormLayout>
  )
}