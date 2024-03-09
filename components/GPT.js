const express = require("express");
const OpenAI = require("openai");
const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: "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",
  organization: "org-WLr8SbLneb2GU2RocRwhX1qg",
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Can you provide me 10 recommendations of the trending movies or TV shows based on my following preferences? Animation, Commedy, Action, Adventure. Return recommendations as a json file of an array. For example, [Mean Girls, The Shining, Chainsaw Man]",
      },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();
