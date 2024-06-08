import axios from "axios";

const token = import.meta.env.VITE_TOKEN;

axios.defaults.baseURL = "https://20.244.56.144/test";

function getPrimes() {
  let config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  console.log(token);
  axios.post("/primes", {}, config).then((response) => {
    console.log(response);
  });
}

export default function Calculator() {
  return (
    <div>
      <h1>Calculator</h1>
      <button onClick={getPrimes}>Primes</button>
    </div>
  );
}
