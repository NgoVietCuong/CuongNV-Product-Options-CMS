export const initialOption = {
  label: "",
  type: 0,
  order: 0,
  textBox: {
    priceAddOn: 0
  },
  numberField: {
    priceAddOn: 0
  },
  checkbox: [{
    optionValue: "",
    priceAddOn: 0
  }],
  radioButton: [{
    optionValue: "",
    priceAddOn: 0
  }],
  dropdownMenu: [{
    optionValue: "",
    priceAddOn: 0
  }],
  swatch: [{
    swatchType: 0,
    colorValue: "",
    imageValue: "",
    optionValue: "",
    priceAddOn: 0
  }],
  button: [{
    optionValue: "",
    priceAddOn: 0
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

export const existOptionError = {
  label: false,
  checkbox: [false],
  radioButton: [false],
  dropdownMenu: [false],
  swatch: [false],
  button: [false]
}

export const optionTypes = [
  {label: 'Text box', value: "0"},
  {label: 'Number field', value: "1"},
  {label: 'Dropdown menu', value: "2"},
  {label: 'Checkbox', value: "3"},
  {label: 'Radio button', value: "4"},
  {label: 'Swatch', value: "5"},
  {label: 'Button', value: "6"},
]