export const initialOption = {
  label: "",
  type: "0",
  textBox: {
    priceAddOn: ""
  },
  numberField: {
    priceAddOn: ""
  },
  checkbox: [{
    optionValue: "",
    priceAddOn: ""
  }],
  radioButton: [{
    optionValue: "",
    priceAddOn: ""
  }],
  dropdownMenu: [{
    optionValue: "",
    priceAddOn: ""
  }],
  // swatch: [{
  //   swatchType: "0",
  //   optionValue: "",
  //   priceAddOn: ""
  // }],
  button: [{
    optionValue: "",
    priceAddOn: ""
  }] 
}

export const initialOptionError = {
  label: true,
  checkbox: [true],
  radioButton: [true],
  dropdownMenu: [true],
  swatch: [true],
  button: [true]
}

export const optionTypes = [
  {label: 'Text box', value: "0"},
  {label: 'Number field', value: "1"},
  {label: 'Dropdown menu', value: "2"},
  {label: 'Checkbox', value: "3"},
  {label: 'Radio button', value: "4"},
  // {label: 'Swatch', value: "5"},
  {label: 'Button', value: "6"},
]