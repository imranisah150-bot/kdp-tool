const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/generate', async (req, res) => {
  const { type, bookTitle, genre, keywords } = req.body;

  const prompts = {
    description: `Write a compelling Amazon book description for a ${genre} book titled "${bookTitle}". Keywords to include: ${keywords}. Make it persuasive and under 4000 characters.`,
    title: `Generate 10 creative book title and subtitle combinations for a ${genre} book about: ${bookTitle}. Format as numbered list.`,
    keywords: `Generate 7 Amazon KDP keyword phrases for a ${genre} book titled "${bookTitle}". These should be long-tail keywords customers search for. Format as numbered list.`,
    backcover: `Write back cover copy for a ${genre} book titled "${bookTitle}". Include a hook, 3 bullet benefits, and a call to action. Keywords: ${keywords}.`
  };

  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompts[type] }]
    }, {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });

    res.json({ result: response.data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});