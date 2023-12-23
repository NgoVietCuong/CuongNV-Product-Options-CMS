export const initialOption = {
  label: "",
  type: "0",
  textBox: {
    priceAddOn: null
  },
  numberField: {
    priceAddOn: null
  },
  checkbox: [{
    optionValue: null,
    priceAddOn: null
  }],
  radioButton: [{
    optionValue: null,
    priceAddOn: null
  }],
  dropdownMenu: [{
    optionValue: null,
    priceAddOn: null
  }],
  swatch: [{
    swatchType: "0",
    optionValue: null,
    priceAddOn: null
  }],
  button: [{
    optionValue: null,
    priceAddOn: null
  }] 
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