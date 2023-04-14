import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-XoCDKxXU5SQKlyZpLwwsMpI2",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = openai.listEngines();

const completion = await openai.createChatCompletion({
    model: "gpt.3.5-turbo",
    messages: [{role: "user" , content: "Hello World"}]
});

console.log(completion.data.choices[0].message);