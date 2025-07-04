import dotenv from 'dotenv'

dotenv.config()

export const askGrok = async (query: string): Promise<string> => {
  const apiKey = process.env.GROK_API_KEY
  if (!apiKey) throw new Error('GROK_API_KEY is not set')

  try {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok',
        messages: [{ role: 'user', content: query }],
        temperature: 0.7,
        max_tokens: 512,
      }),
    })

    if (!response.ok) {
      throw new Error(`Grok API returned status ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Grok error:', error)
    throw new Error('Grok API request failed')
  }
}