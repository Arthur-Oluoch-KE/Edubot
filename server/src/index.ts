import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { askMathstral } from './mathstral'
import { askGrok } from './grok'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const isMathQuery = (question: string): boolean => {
  const mathKeywords = /\b(solve|calculate|math|equation|algebra|geometry)\b/i
  return mathKeywords.test(question)
}

// Wrap async route handlers to catch errors and pass them to Express error handler
function asyncHandler(
  fn: (req: Request, res: Response) => Promise<any>
) {
  return (req: Request, res: Response, next: express.NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next)
  }
}

app.post(
  '/api/ask',
  asyncHandler(async (req: Request, res: Response) => {
    const { question, subject } = req.body as { question: string; subject: string }
    if (!question) return res.status(400).json({ error: 'Question is required' })

    const inappropriateContent = /\b(badword1|badword2)\b/i
    if (inappropriateContent.test(question)) {
      return res.status(400).json({ error: 'Inappropriate content detected' })
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
      res.json({ response })
    } catch (error) {
      console.error(error)
      try {
        const fallbackResponse =
          subject === 'math' || isMathQuery(question)
            ? await askGrok(question)
            : await askMathstral(question)
        res.json({
          response:
            fallbackResponse ||
            'Sorry, I couldn’t find an answer. Try rephrasing your question!',
        })
      } catch (fallbackError) {
        res
          .status(500)
          .json({ error: 'Both APIs failed. Please try again later.' })
      }
    }
  })
)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))