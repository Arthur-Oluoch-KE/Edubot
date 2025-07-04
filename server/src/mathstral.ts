import dotenv from 'dotenv'

     dotenv.config()

     export const askMathstral = async (query: string): Promise<string> => {
       const apiKey = process.env.HUGGINGFACE_API_KEY
       if (!apiKey) throw new Error('HUGGINGFACE_API_KEY is not set')

       try {
         const response = await fetch('https://api-inference.huggingface.co/models/mistralai/mathstral-7b-v0.1', {
           method: 'POST',
           headers: {
             'Authorization': `Bearer ${apiKey}`,
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ inputs: query }),
         })

         if (!response.ok) {
           throw new Error(`Mathstral API returned status ${response.status}: ${await response.text()}`)
         }

         const data = await response.json()
         return data[0]?.generated_text || ''
       } catch (error) {
         console.error('Mathstral error:', error)
         throw new Error('Mathstral API request failed')
       }
     }