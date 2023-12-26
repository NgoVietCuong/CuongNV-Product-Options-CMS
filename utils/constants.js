export const initialOption = {
  label: "",
  type: 2,
  order: 0,
  textBox: {
    priceAddOn: NaN
  },
  numberField: {
    priceAddOn: NaN
  },
  checkbox: [{
    optionValue: "",
    priceAddOn: NaN
  }],
  radioButton: [{
    optionValue: "",
    priceAddOn: NaN
  }],
  dropdownMenu: [{
    optionValue: "",
    priceAddOn: NaN
  }],
  // swatch: [{
  //   swatchType: 0,
  //   optionValue: "",
  //   priceAddOn: NaN
  // }],
  button: [{
    optionValue: "",
    priceAddOn: NaN
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