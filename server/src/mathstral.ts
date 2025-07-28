import dotenv from 'dotenv'

dotenv.config()

export const askMathstral = async (question: string): Promise<string> => {
  const apiKey = process.env.HUGGINGFACE_API_KEY
  if (!apiKey) throw new Error('HUGGINGFACE_API_KEY is not set')

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `<s>[INST] ${question} [/INST]`,
        parameters: { max_new_tokens: 512, temperature: 0.7 },
      }),
    })

    if (!response.ok) {
      throw new Error(`Hugging Face API returned status ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    return data[0]?.generated_text || ''
  } catch (error) {
    console.error('Hugging Face error:', error)
    throw new Error('Hugging Face API request failed')
  }
}