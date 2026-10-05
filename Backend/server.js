import OpenAI from 'openai';
import 'dotenv/config';

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

const response = await client.chat.completions.create({
  model: 'gemini-3.5-flash',
  messages: [{ role: 'user', content: 'Joke related to computer science' }],
});

console.log(response.choices[0].message.content);