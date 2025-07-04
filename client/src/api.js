export const askQuestion = async (query, subject) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/ask'
  const vercelApiUrl = import.meta.env.VITE_VERCEL_API_URL || 'https://edubot-ixey.vercel.app/api/ask'
  const isProduction = import.meta.env.MODE === 'production'
  const targetUrl = isProduction ? vercelApiUrl : apiUrl

  const body = JSON.stringify({ query, subject })

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`)
    const data = await response.json()
    return data.response || 'No response received from server'
  } catch (error) {
    throw new Error(`Failed to fetch: ${error.message}`)
  }
}