import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";
import { apiPostGPT, OPEN_AI_KEY } from "../services/apiService";
import { arrayItems } from "./chatGPT/aiOptions";
import OptionSelection from "./chatGPT/optionSelection";
import Translation from "./chatGPT/translation";

function Chat() {
  const [option, setOption] = useState({});
  const [result, setResult] = useState("");
  const [input, setInput] = useState("");
  
  console.log(OPEN_AI_KEY);
 

  const doStuff = async () => {
    let url = 'https://api.openai.com/v1/chat/completions'
    let body = {
      "model": "gpt-3.5-turbo",
      "messages": [{ "role": "user", "content": "Hello!" }]
    }

    const response = await apiPostGPT(url, body);

    console.log(response.data.choices[0].message.content);
    setResult(response.data.choices[0].message.content);
  };

  return (
    <div className="App">
      <button onClick={doStuff}>Click</button>
      <h2>{result}</h2>
    </div>
  );
}

export default Chat;
