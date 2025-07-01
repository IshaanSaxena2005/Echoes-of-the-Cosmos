const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const COHERE_API_KEY = process.env.COHERE_API_KEY;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const userMessage = messages[messages.length - 1].content;

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt: `You are a helpful space exploration assistant. Answer this question: ${userMessage}`,
        max_tokens: 100,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
      },
      {
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.generations && response.data.generations[0]) {
      res.json({ 
        choices: [{ 
          message: { 
            content: response.data.generations[0].text 
          } 
        }] 
      });
    } else {
      res.json({ 
        choices: [{ 
          message: { 
            content: "I'm here to help with your space exploration questions!" 
          } 
        }] 
      });
    }
  } catch (err) {
    console.error('API Error:', err.message);
    res.json({ 
      choices: [{ 
        message: { 
          content: "Hello! I'm your AI assistant. I'm having trouble connecting right now, but I'm here to help with your space exploration questions!" 
        } 
      }] 
    });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));