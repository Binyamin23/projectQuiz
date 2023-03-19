import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";
import { OPEN_AI_KEY } from "../services/apiService";
import { arrayItems } from "./chatGPT/aiOptions";
import OptionSelection from "./chatGPT/optionSelection";
import Translation from "./chatGPT/translation";

function Chat() {
  const configuration = new Configuration({
    apiKey: OPEN_AI_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const [option, setOption] = useState({});
  const [result, setResult] = useState("");
  const [input, setInput] = useState("");
  console.log(OPEN_AI_KEY);
  const selectOption = (option) => {
    setOption(option);
  };

  const doStuff = async () => {
    const response = await openai.completions.create({
      model: "davinci",
      prompt: "Hello,",
      maxTokens: 5,
      n: 1,
      stop: "\n",
    });
    console.log(response.data.choices[0].text);
    setResult(response.data.choices[0].text);
  };

  return (
    <div className="App">
      <button onClick={doStuff}>Click</button>
    </div>
  );
}

export default Chat;
