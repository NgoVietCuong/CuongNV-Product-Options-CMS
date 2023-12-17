import axios from "axios";

export async function fetchData(props) {
  const [url, jwt] = props;
  const res = await axios({
    url: url,
    method: "get",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    }
  });

  return res.data;
}

export async function updateData(props) {
  const [url, jwt, data] = props;
  const res = await axios({
    url: url,
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`
    },
    data: data
  });

  return res.data;
}