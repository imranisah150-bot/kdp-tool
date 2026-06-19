const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate', async (req, res) => {
  const { type, bookTitle, genre, keywords } = req.body;

  const prompts = {
    description: `Write a compelling Amazon book description for a ${genre} book titled "${bookTitle}". Keywords: ${keywords}. Make it persuasive and under 4000 characters.`,
    title: `Generate 10 creative book title and subtitle combinations for a ${genre} book about: ${bookTitle}. Format as numbered list.`,
    keywords: `Generate 7 Amazon KDP keyword phrases for a ${genre} book titled "${bookTitle}". Long-tail keywords customers search for. Format as numbered list.`,
    backcover: `Write back cover copy for a ${genre} book titled "${bookTitle}". Include a hook, 3 bullet benefits, and a call to action. Keywords: ${keywords}.`
  };

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompts[type] }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({ result: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});