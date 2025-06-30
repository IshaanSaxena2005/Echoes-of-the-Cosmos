const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = 'sk-proj-2eQfpBSF4yZcTg1bCIV6N1XUoVEfE0mVnNtPW4LtS4C4Q1UROLbnt0ShwsM7220pvIRqNnEilrT3BlbkFJspm1gSKKbZjbzc6RDxFt1Ptmg46qafVNO1qRNfC-iDiHbdkEGCr3d6S4m9bWKFbep75oc4qowAdo'; // <-- Your real key here

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 300,
        temperature: 0.7
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy server error' });
  }
});

app.listen(3000, () => console.log('Chatbot proxy running on port 3000'));