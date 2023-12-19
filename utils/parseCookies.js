export default function parseCookies(cookieString) {
  const keyValuePairStrings = cookieString.split("; ");
  const cookies = {};

  keyValuePairStrings.forEach(str => {
    const keyValueArray = str.split("=");
    const key = keyValueArray[0];
    const value = keyValueArray[1];
    cookies[key] = value;
  });

  return cookies
}