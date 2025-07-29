const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; 

// Middleware

app.use(express.json());

app.use(cors({
  origin: 'https://edubot-eight.vercel.app',   
  credentials: true,
}))

// Mathstral-7B API call
async function askMathstral(question) {
  try {
    if (!question || /inappropriate|offensive/i.test(question)) {
      throw new Error('Inappropriate content detected');
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `You are an educational tutor for children aged 8–14, teaching math. Provide clear, accurate, unbiased, and age-appropriate answers. Solve the question step-by-step in a simple, engaging way, like talking to a middle school student. Question: ${question}`,
          parameters: { max_length: 500, temperature: 0.7 },
        }),
      }
    );

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data[0].generated_text;
  } catch (error) {
    throw new Error(`Mathstral API error: ${error.message}`);
  }
}

async function askGrok(question) {
  try {
    if (!question || /inappropriate|offensive/i.test(question)) {
      throw new Error('Inappropriate content detected');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct', // Or another OpenRouter model
        messages: [
          {
            role: 'system',
            content:
              'You are an educational tutor for children aged 8–14, teaching subjects like science, history, and language arts. Provide clear, accurate, unbiased, and age-appropriate answers. For procedural questions, explain step-by-step in a simple, engaging way. For general knowledge, use fun examples or analogies.',
          },
          { role: 'user', content: question },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenRouter API error: ${error.message}`);
  }
}

// API endpoint
app.post('/api/ask', async (req, res) => {
  try {
    const { question, subject } = req.body;
    console.log('Request body:', req.body); // Debug log
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    let answer;
    const isMathQuery =
      subject === 'math' ||
      /solve|calculate|equation|geometry|algebra/i.test(question);

    try {
      answer = isMathQuery ? await askMathstral(question) : await askGrok(question);
    } catch (error) {
      answer = isMathQuery ? await askGrok(question) : await askMathstral(question);
    }

    res.status(200).json({ answer });
  } catch (error) {
    console.error('Server error:', error.message); // Debug log
    res.status(500).json({ error: `Failed to process request: ${error.message}` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});