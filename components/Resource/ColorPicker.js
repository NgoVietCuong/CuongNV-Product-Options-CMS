import { useState } from "react";
import { FormLayout, TextField, ColorPicker } from "@shopify/polaris";

export default function SwatchColorPicker({ value, setValue, color, setColor}) {
  console.log('color', color)
  return (
    <FormLayout>
      <TextField
        label="Color Picker (Hex)"
        prefix="#"
        value={value}
        onChange={setValue}
      />
      <ColorPicker onChange={setColor} color={color}/>
    </FormLayout>
  )
}