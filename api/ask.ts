import { VercelRequest, VercelResponse } from '@vercel/node'
import { askMathstral } from '../server/src/mathstral'
import { askGrok } from '../server/src/grok'

const isMathQuery = (question: string): boolean => {
  const mathKeywords = /\b(solve|calculate|math|equation|algebra|geometry)\b/i
  return mathKeywords.test(question)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).setHeader('Access-Control-Allow-Origin', '*')
      .json({ error: 'Method not allowed' })
  }

  // Check for required environment variables
  if (!process.env.HUGGINGFACE_API_KEY) {
    return res.status(500).setHeader('Access-Control-Allow-Origin', '*')
      .json({ error: 'Server configuration error: HUGGINGFACE_API_KEY is not set' })
  }
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).setHeader('Access-Control-Allow-Origin', '*')
      .json({ error: 'Server configuration error: OPENROUTER_API_KEY is not set' })
  }

  const { question, subject } = req.body as { question: string; subject: string }
  if (!question) {
    return res.status(400).setHeader('Access-Control-Allow-Origin', '*')
      .json({ error: 'Question is required' })
  }

  const inappropriateContent = /\b(badword1|badword2)\b/i
  if (inappropriateContent.test(question)) {
    return res.status(400).setHeader('Access-Control-Allow-Origin', '*')
      .json({ error: 'Inappropriate content detected' })
  }

  try {
    let response: string
    if (subject === 'math' || isMathQuery(question)) {
      response = await askMathstral(question)
      if (!response) throw new Error('Mathstral failed')
    } else {
      response = await askGrok(question)
      if (!response) throw new Error('Grok failed')
    }
    res.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .json({ response })
  } catch (error) {
    console.error(error)
    try {
      const fallbackResponse = subject === 'math' || isMathQuery(question) ? await askGrok(question) : await askMathstral(question)
      res.status(200).setHeader('Access-Control-Allow-Origin', '*')
        .json({ response: fallbackResponse || 'Sorry, I couldn’t find an answer. Try rephrasing your question!' })
    } catch (fallbackError) {
      res.status(500).setHeader('Access-Control-Allow-Origin', '*')
        .json({ error: 'Both APIs failed. Please try again later.' })
    }
  }
}
