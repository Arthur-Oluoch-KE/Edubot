export const askQuestion = async (query, subject) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/ask'
  const vercelApiUrl = import.meta.env.VITE_VERCEL_API_URL

  const body = JSON.stringify({ query, subject })

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    return data.response
  } catch (error) {
    if (vercelApiUrl) {
      const fallbackResponse = await fetch(vercelApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
      if (!fallbackResponse.ok) throw new Error('Fallback network response was not ok')
      const fallbackData = await fallbackResponse.json()
      return fallbackData.response
    }
    throw error
  }
}