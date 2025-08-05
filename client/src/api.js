export const askQuestion = async (question, subject) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/ask';
  const vercelApiUrl = import.meta.env.VITE_VERCEL_API_URL || 'https://edubot-2ldu.onrender.com';
  const isProduction = import.meta.env.MODE === 'production'
  const targetUrl = isProduction ? vercelApiUrl : apiUrl

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, subject }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Network response was not ok: ${response.status}, ${JSON.stringify(errorData)}`);
    }
    const data = await response.json();
    console.log('api.js response:', data);  
    return data.answer || data;  
  } catch (error) {
    console.error('Error:', error.message);
    throw new Error(`Failed to fetch: ${error.message}`);
  }
};




