import convert from "color-convert";

export function HexToHSV(color) {
  const Reg_Exp = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
  if (Reg_Exp.test(`#${color}`)) {
    const hsvColor = convert.hex.hsv(color);
    const [h, s, b] = hsvColor;
    return { hue: h, saturation: s/100, brightness: b/100, alpha: 1 };
  } else {
    return { hue: 0, saturation: 0, brightness: 0, alpha: 1 };
  }
}

export function HSVToHex(color) {
  let { hue: h, saturation: s, brightness: b} = color;
  s = s*100;
  b = b*100;
  return convert.hsv.hex(h, s, b);
}